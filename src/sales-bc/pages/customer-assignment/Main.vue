<template>
  <ProgressSpinner v-if="fetchingInitialData" />
  <div v-else class="page-section">
    <h1 class="text-2xl mt-2">Customer Assignment List</h1>
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
              <p class="text-2xl font-semibold">{{ item.total }}</p>
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
        @row-click="(event) => router.push(`/sales/customer-assignment/${event.data.id}`)"
        size="small"
        fluid
        class="w-full"
      >
        <Column field="customerName" header="Customer Name"></Column>
        <Column field="customerPhone" header="Customer Phone"></Column>
        <Column field="verificationScore" header="Verification Score"></Column>
        <Column field="customerJourneyName" header="Customer Journey"></Column>
        <Column
          :field="(el) => new Date(el.createdTime).toLocaleString('id-ID')"
          header="Assign Time"
        ></Column>
      </DataTable>
    </OffsetPaginationComponent>
  </div>
</template>

<script setup lang="ts">
import { KeywordSearch } from "@/resources/components/abstract-pagination";
import OffsetPagination, { OffsetLimit } from "@/resources/components/offset-pagination";
import OffsetPaginationComponent from "@/resources/components/OffsetPaginationComponent.vue";
import { ExtendedCustomerAssignmentType } from "@/sales-bc/domain/model/sales/customer-assignment";
import CustomerAssignmentService from "@/sales-bc/domain/service/customer-assignment-service";
import { CustomerAssignmentStatus } from "@/shared-bc/domain/enum/customer-assignment-status";
import EmptyDataIllustrationComponent from "@/shared/components/EmptyDataIllustrationComponent.vue";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { switchCase } from "@babel/types";
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const { salesRepository } = useDependencyInjection();
const router = useRouter();
const route = useRoute();
const customerAssignmentService = new CustomerAssignmentService(salesRepository.getUser());
const pagination = reactive(
  new OffsetPagination<ExtendedCustomerAssignmentType>(
    (pagination) => customerAssignmentService.customerAssignmentListRest(pagination),
    [],
    new KeywordSearch(["Customer.name", "Customer.phone"]),
    new OffsetLimit(10, 1, [
      { title: "Highest Score", column: "verificationScore", direction: "DESC" },
      { title: "Lowest Score", column: "verificationScore", direction: "ASC" },
      { title: "Newest", column: "CustomerAssignment.createdTime", direction: "DESC" },
      { title: "Oldest", column: "CustomerAssignment.createdTime", direction: "ASC" },
    ])
  )
);

const fetchingInitialData = ref(true);
onMounted(async () => {
  await viewSummary();
  if (route.query.card) {
    switch (route.query.card) {
      case "New":
        await fetchNewAssignmentList();
        break;
      case "Idle":
        await fetchIdleAssignmentList();
        break;
      default:
        break;
    }
  } else {
    await fetchActiveAssignmentList();
  }
  //
  fetchingInitialData.value = false;
});

const viewSummary = async () => {
  type ResponseType = {
    newAssignmentCount: number;
    idleAssignmentCount: number;
    activeAssignmentCount: number;
  };
  const response = await salesRepository.getUser().executeSalesGraphqlQuery<ResponseType>([
    {
      operation: { name: "totalCustomerAssignment", alias: "newAssignmentCount" },
      variables: {
        newAssignmentFilters: {
          type: "[FilterInput]",
          name: "filters",
          value: [
            { column: "CustomerAssignment.status", value: "ACTIVE" },
            { column: "hasSalesActivitySchedule", value: false },
          ],
        },
      },
      fields: [],
    },
    {
      operation: { name: "totalCustomerAssignment", alias: "idleAssignmentCount" },
      variables: {
        assignmentWithoutActiveScheduleFilters: {
          type: "[FilterInput]",
          name: "filters",
          value: [
            { column: "CustomerAssignment.status", value: CustomerAssignmentStatus.ACTIVE },
            { column: "hasSalesActivitySchedule", value: true },
            { column: "hasActiveSalesActivitySchedule", value: false },
            { column: "hasPendingClosingRequest", value: false },
            { column: "hasPendingRecycleRequest", value: false },
          ],
        },
      },
      fields: [],
    },
    {
      operation: { name: "totalCustomerAssignment", alias: "activeAssignmentCount" },
      variables: {
        activeFilters: {
          type: "[FilterInput]",
          name: "filters",
          value: [{ column: "CustomerAssignment.status", value: CustomerAssignmentStatus.ACTIVE }],
        },
      },
      fields: [],
    },
  ]);
  predefinedFilterCardItems.find((el) => el.title === "Active")!.total =
    response.activeAssignmentCount;
  predefinedFilterCardItems.find((el) => el.title === "New")!.total = response.newAssignmentCount;
  predefinedFilterCardItems.find((el) => el.title === "Idle")!.total = response.idleAssignmentCount;
};

const fetchingList = ref(false);
const resetHiddenFilterAndApplyActiveAssignmentFilter = () => {
  fetchingList.value = true;
  pagination.clearHiddenFilter();
  pagination.addHiddenFilter({
    column: "CustomerAssignment.Status",
    value: CustomerAssignmentStatus.ACTIVE,
  });
};
const selectedCardTitle = ref("Active");
const fetchNewAssignmentList = async () => {
  selectedCardTitle.value = "New";
  console.log("fetchNewAssignmentList");
  resetHiddenFilterAndApplyActiveAssignmentFilter();
  pagination.addHiddenFilter({ column: "hasSalesActivitySchedule", value: 0 });
  await pagination.loadPage();
  fetchingList.value = false;
};
const fetchIdleAssignmentList = async () => {
  selectedCardTitle.value = "Idle";
  resetHiddenFilterAndApplyActiveAssignmentFilter();
  pagination.addHiddenFilter({ column: "hasSalesActivitySchedule", value: 1 });
  pagination.addHiddenFilter({ column: "hasActiveSalesActivitySchedule", value: 0 });
  pagination.addHiddenFilter({ column: "hasPendingClosingRequest", value: 0 });
  pagination.addHiddenFilter({ column: "hasPendingRecycleRequest", value: 0 });
  await pagination.loadPage();
  fetchingList.value = false;
};
const fetchActiveAssignmentList = async () => {
  selectedCardTitle.value = "Active";
  resetHiddenFilterAndApplyActiveAssignmentFilter();
  await pagination.loadPage();
  fetchingList.value = false;
};
const predefinedFilterCardItems = reactive([
  {
    ...{ title: "Active", icon: "mdi mdi-account-tie", iconBgColor: "bg-slate-200", total: 0 },
    action: fetchActiveAssignmentList,
  },
  {
    ...{ title: "New", icon: "mdi mdi-account-alert-outline", iconBgColor: "bg-slate-200" },
    ...{ total: 0, action: fetchNewAssignmentList },
  },
  {
    ...{ title: "Idle", icon: "mdi mdi-bed-outline", iconBgColor: "bg-slate-200", total: 0 },
    action: fetchIdleAssignmentList,
  },
]);
</script>

<style scoped></style>
