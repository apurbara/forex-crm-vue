<template>
  <ProgressSpinner v-if="fetchingInitialData" />
  <div v-else class="page-section">
    <h1 class="text-2xl mt-2">Activity List</h1>
    <div class="flex justify-start flex-wrap gap-8 mt-6">
      <Card
        class="w-1/6"
        v-for="(item, key) in predefinedFilterCardItems"
        :key="key"
        @click="() => (item.title === selectedCardTitle ? {} : item.action())"
        :class="
          item.title === selectedCardTitle
            ? `!bg-amber-200 drop-shadow-lg scale-105font-semibold`
            : `hover:drop-shadow-md hover:scale-105 hover:cursor-pointer !bg-slate-100`
        "
      >
        <template #content>
          <div class="flex justify-between gap-4">
            <div class="flex flex-col gap-2">
              <p class="text-sm text-grey">{{ item.title }}</p>
              <p v-if="item.total !== undefined" class="text-2xl font-semibold">{{ item.total }}</p>
            </div>
            <div
              class="flex size-9 align-center justify-center rounded-lg"
              :class="item.iconBgColor"
            >
              <i :class="item.icon" class="text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>
    <OffsetPaginationComponent :pagination="pagination" class="mt-8">
      <ProgressSpinner v-if="fetchingList" />
      <EmptyDataIllustrationComponent
        v-else-if="!pagination.resultList.length"
        message="no assignment data"
      />
      <DataTable
        v-else
        :value="pagination.resultList"
        selectionMode="single"
        @row-click="
          (event) => router.push(`/sales/customer-assignment/${event.data.CustomerAssignment_id}`)
        "
        size="small"
        fluid
        class="w-full"
      >
        <Column field="customerName" header="Customer Name"></Column>
        <Column field="customerPhone" header="Customer Phone"></Column>
        <Column field="salesActivityName" header="Activity"></Column>
        <Column
          :field="(el) => new Date(el.startTime).toLocaleString('id-ID')"
          header="Time"
        ></Column>
      </DataTable>
    </OffsetPaginationComponent>
  </div>
</template>

<script setup lang="ts">
import { KeywordSearch } from "@/resources/components/abstract-pagination";
import OffsetPagination, { OffsetLimit } from "@/resources/components/offset-pagination";
import OffsetPaginationComponent from "@/resources/components/OffsetPaginationComponent.vue";
import { ExtendedSalesActivityScheduleType } from "@/sales-bc/domain/model/sales/customer-assignment/salesActivitySchedule";
import SalesActivityScheduleService from "@/sales-bc/domain/service/sales-activity-schedule-service";
import { SalesActivityScheduleStatus } from "@/shared-bc/domain/enum/sales-activity-schedule-status";
import EmptyDataIllustrationComponent from "@/shared/components/EmptyDataIllustrationComponent.vue";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const { salesRepository } = useDependencyInjection();
const router = useRouter();
const route = useRoute();
const salesActivityScheduleService = new SalesActivityScheduleService(salesRepository.getUser());
const pagination = reactive(
  new OffsetPagination<ExtendedSalesActivityScheduleType>(
    (pagination) => salesActivityScheduleService.salesActivityScheduleListRest(pagination),
    [],
    new KeywordSearch(["Customer.name", "Customer.phone"]),
    new OffsetLimit(10, 1, [
      { title: "Newest", column: "SalesActivitySchedule.startTime", direction: "DESC" },
      { title: "Oldest", column: "SalesActivitySchedule.startTime", direction: "ASC" },
    ])
  )
);

const fetchingInitialData = ref(true);
onMounted(async () => {
  await viewSummary();
  if (route.query.card) {
    switch (route.query.card) {
      case "Upcoming":
        await fetchUpcomingActivityList();
        break;
      default:
        await fetchPastActivityList();
        break;
    }
  } else {
    await fetchPastActivityList();
  }
  //
  fetchingInitialData.value = false;
});

const viewSummary = async () => {
  type ResponseType = {
    upcomingScheduleCount: number;
    pastScheduleCount: number;
  };
  const response = await salesRepository.getUser().executeSalesGraphqlQuery<ResponseType>([
    {
      operation: { name: "totalSalesActivitySchedule", alias: "upcomingScheduleCount" },
      variables: {
        upcomingScheduleFilters: {
          type: "[FilterInput]",
          name: "filters",
          value: [
            {
              column: "SalesActivitySchedule.startTime",
              value: new Date().toISOString(),
              comparisonType: "GTE",
            },
            {
              column: "SalesActivitySchedule.status",
              value: SalesActivityScheduleStatus.SCHEDULED,
            },
          ],
        },
      },
      fields: [],
    },
    {
      operation: { name: "totalSalesActivitySchedule", alias: "pastScheduleCount" },
      variables: {
        pastScheduleFilters: {
          type: "[FilterInput]",
          name: "filters",
          value: [
            {
              column: "SalesActivitySchedule.endTime",
              value: new Date().toISOString(),
              comparisonType: "LTE",
            },
            {
              column: "SalesActivitySchedule.status",
              value: SalesActivityScheduleStatus.SCHEDULED,
            },
          ],
        },
      },
      fields: [],
    },
  ]);
  predefinedFilterCardItems.find((el) => el.title === "Past")!.total = response.pastScheduleCount;
  predefinedFilterCardItems.find((el) => el.title === "Upcoming")!.total =
    response.upcomingScheduleCount;
};

const fetchingList = ref(false);
const resetHiddenFilter = () => {
  fetchingList.value = true;
  pagination.clearHiddenFilter();
};
const selectedCardTitle = ref("Active");
const fetchPastActivityList = async () => {
  selectedCardTitle.value = "Past";
  resetHiddenFilter();
  pagination.addHiddenFilter({
    column: "SalesActivitySchedule.Status",
    value: SalesActivityScheduleStatus.SCHEDULED,
  });
  pagination.addHiddenFilter({
    column: "SalesActivitySchedule.endTime",
    value: new Date().toISOString(),
    comparisonType: "LTE",
  });
  await pagination.resetList();
  fetchingList.value = false;
};
const fetchUpcomingActivityList = async () => {
  selectedCardTitle.value = "Upcoming";
  resetHiddenFilter();
  pagination.addHiddenFilter({
    column: "SalesActivitySchedule.Status",
    value: SalesActivityScheduleStatus.SCHEDULED,
  });
  pagination.addHiddenFilter({
    column: "SalesActivitySchedule.startTime",
    value: new Date().toISOString(),
    comparisonType: "GTE",
  });
  await pagination.resetList();
  fetchingList.value = false;
};
const fetchCompletedActivityList = async () => {
  selectedCardTitle.value = "Completed";
  resetHiddenFilter();
  pagination.addHiddenFilter({
    column: "SalesActivitySchedule.Status",
    value: SalesActivityScheduleStatus.COMPLETED,
  });
  await pagination.resetList();
  fetchingList.value = false;
};

const predefinedFilterCardItems = reactive([
  {
    ...{ title: "Past", icon: "mdi mdi-clock-alert-outline", iconBgColor: "bg-slate-200" },
    ...{ total: 0, action: fetchPastActivityList },
  },
  {
    ...{ title: "Upcoming", icon: "mdi mdi-phone-clock", iconBgColor: "bg-slate-200" },
    ...{ total: 0, action: fetchUpcomingActivityList },
  },
  {
    ...{ title: "Completed", icon: "mdi mdi-clock-check-outline", iconBgColor: "bg-slate-200" },
    ...{ total: undefined, action: fetchCompletedActivityList },
  },
]);
</script>

<style scoped></style>
