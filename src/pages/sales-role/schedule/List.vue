<template>
  <div>
    <h1 class="page-title">Schedule List</h1>
    <div class="d-flex justify-space-around mb-8">
      <v-card class="pa-4 ma-2">
        <v-card-title>{{ totalUpcomingSchedule }}</v-card-title>
        <v-card-subtitle>upcoming</v-card-subtitle>
      </v-card>
      <v-card class="pa-4 ma-2">
        <v-card-title>{{ totalPastScheduleWithoutReport }}</v-card-title>
        <v-card-subtitle>report required</v-card-subtitle>
      </v-card>
    </div>
    <div></div>
    <CursorPaginationComponent :pagination="schedulePagination">
      <template v-slot:editSection>
        <v-btn prepend-icon="mdi-account-plus-outline" variant="tonal" to="/schedule/register">Add Schedule</v-btn>
      </template>
      <div height="400px" density="compact" class="card-list">
        <ItemCardComponent class="card-list__item" v-for="(schedule, key) in schedulePagination.resultList" :key="key"
          :item="{ name: schedule.assignedCustomer?.customer?.name }"
          :to="`/assigned-customer/${schedule.assignedCustomer?.id}`">
          <div><v-chip color="success">{{ schedule.status }}</v-chip></div>
          <p>{{ schedule.startTime }} - {{ schedule.endTime }}</p>
          <p>{{ schedule.salesActivity?.name }} - {{ schedule.salesActivity?.duration }}</p>
        </ItemCardComponent>
      </div>
    </CursorPaginationComponent>
  </div>
</template>

<script lang="ts" setup>
import { KeywordSearch, PaginationResponseType } from '@/resources/components/abstract-pagination';
import EnumFilter from '@/resources/components/pagination/enum-filter';
import { Ref, reactive } from 'vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import SalesRole from '@/domain/user-role/personnel/sales-role';
import CursorPagination from '@/resources/components/cursor-pagination';
import CursorPaginationComponent from '@/resources/components/CursorPaginationComponent.vue';
import { SalesActivityScheduleType } from '@/domain/model/personnel/manager/sales/assigned-customer/sales-activity-schedule';
import ItemCardComponent from '@/shared/components/item-card-component.vue';
import { ref } from 'vue';
//
import type { Configs, Appointment } from "vue-pro-calendar";

const { httpRequest, userRepository } = useDependencyInjection();
const totalUpcomingSchedule = ref<number>(0)
const totalPastScheduleWithoutReport = ref<number>(0)
const calendarView = ref<boolean>(true)

const schedulePagination = reactive(new CursorPagination<SalesActivityScheduleType>(
  async (pagination) => {
    const response = await userRepository.getUser<SalesRole>()
      .executeSalesGraphqlQuery<{ salesActivityScheduleList: PaginationResponseType<SalesActivityScheduleType> }>(httpRequest, {
        operation: "salesActivityScheduleList",
        variables: pagination.toGraphqlVariables(),
        fields: CursorPagination.wrapResultFields([
          "id", "status", "startTime", "endTime",
          { assignedCustomer: ["id", { customer: ["name"] }] },
          { salesActivity: ["name", "duration"] }
        ])
      })
    return response.salesActivityScheduleList;
  },
  [
    new EnumFilter('disabled', 'Schedule.disabled', () => [{ status: true, name: 'disabled' }, { status: false, name: 'active' }], 'IN', undefined, 'name', 'status'),
  ],
  new KeywordSearch(["Schedule.name", "Schedule.email"])
))

onMounted(async () => {
  await schedulePagination.loadPage()
  await viewSummary()
})

const viewSummary = async () => {
  const currentTime = new Date()
  const currentTimeString = `${currentTime.getFullYear()}-${currentTime.getMonth() + 1}-${currentTime.getDate()} ${currentTime.getHours()}:00:00`
  const response = await userRepository.getUser<SalesRole>()
    .executeSalesGraphqlQuery<{ totalUpcomingSchedule: number, totalPastScheduleWithoutReport: number }>(httpRequest, [
      {
        operation: { name: "totalSalesActivitySchedule", alias: "totalUpcomingSchedule" },
        variables: {
          upcomingFilters: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "SalesActivitySchedule.status", value: 'SCHEDULED' },
              { column: "SalesActivitySchedule.endTime", value: currentTimeString, comparisonType: 'GTE' }
            ]
          }
        },
        fields: []
      },
      {
        operation: { name: "totalSalesActivitySchedule", alias: "totalPastScheduleWithoutReport" },
        variables: {
          pastWithoutReportFilters: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "SalesActivitySchedule.status", value: 'SCHEDULED' },
              { column: "SalesActivitySchedule.endTime", value: currentTimeString, comparisonType: 'LTE' }
            ]
          }
        },
        fields: []
      },
    ])
  totalUpcomingSchedule.value = response.totalUpcomingSchedule
  totalPastScheduleWithoutReport.value = response.totalPastScheduleWithoutReport
}

//
const cfg = ref<Configs>({
  viewEvent: undefined,
  reportEvent: {
    icon: true,
    text: "",
  },
  searchPlaceholder: "",
  eventName: "",
  closeText: "",
  nativeDatepicker: true,
  // todayButton: true,
  // firstDayOfWeek: 1,
});

const evts: Ref<Appointment[]> = ref([
  {
    date: "2022-11-19T14:00:00.000Z",
    comment: "",
    id: "cl32rbkjk1700101o53e3e3uhn",
    keywords: "Projet BAMBA",
    name: "MONTCHO Kévin",
  },
  //...
]);

</script>

<style lang="scss" scoped></style>