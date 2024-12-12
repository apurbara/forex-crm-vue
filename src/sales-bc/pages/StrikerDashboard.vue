<template>
  <h1 class="page-title">Sales Dashboard</h1>
  <div class="d-flex justify-space-between flex-wrap">
    <NotificationCardComponent :title="'Upcoming Activity'" :info="upcomingScheduleCount"
      @click="toActivityPage('upcoming-activity')" />
    <NotificationCardComponent :title="'Past Activity'" :info="pastScheduleCount"
      @click="toActivityPage('past-activity')" />
    <NotificationCardComponent :title="'New Assignment'" :info="newAssignment"
      @click="toAssignmentPage('new-assignment')" />
    <NotificationCardComponent :title="'Idle Assignment'" :info="idleAssignment"
      @click="toAssignmentPage('idle-assignment')" />
  </div>
  <StrikerDashboardMetricComponent />
  <SalesDashboardCalendarSection />
  <!-- <section class="page-section calendar-container is-light-mode">
    <Qalendar :events="calendarSchedules" :config="config" @updated-period="periodUpdated" />
  </section> -->
</template>

<script lang="ts" setup>
// import "vue-pro-calendar/style";
// import { useIsoToLocalTimeFormat, useTimeIntervalDifferenceCounter } from "@/resources/composables/typography";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
// import { Qalendar } from "qalendar";
import { onMounted, ref } from "vue";
import SalesDashboardMetricComponent from "./SalesDashboardMetricComponent.vue";
import { SalesActivityScheduleStatus } from "@/shared-bc/domain/enum/sales-activity-schedule-status";
import { CustomerAssignmentStatus } from "@/shared-bc/domain/enum/customer-assignment-status";
import { useRouter } from "vue-router";
// import { SalesActivityScheduleSummaryType } from "../domain/model/sales/customer-assignment/salesActivitySchedule";
import NotificationCardComponent from "@/shared/components/NotificationCardComponent.vue";
import SalesDashboardCalendarSection from "./SalesDashboardCalendarSection.vue";
import StrikerDashboardMetricComponent from "./StrikerDashboardMetricComponent.vue";

const { salesRepository } = useDependencyInjection()
// const salesActivityScheduleSummaryList = ref<SalesActivityScheduleSummaryType[]>([])
const upcomingScheduleCount = ref<number>(0)
const pastScheduleCount = ref<number>(0)
const newAssignment = ref<number>(0)
const idleAssignment = ref<number>(0)

// const calendarSchedules = computed(() => {
//   return salesActivityScheduleSummaryList.value.map((list) => {
//     const { diffStatus } = useTimeIntervalDifferenceCounter(list.startTime!, list.endTime!)
//     return {
//       id: list.startTime! + list.status!,
//       title: `${list.total} ` + (diffStatus === 'UPCOMING' ? ' upcoming' : diffStatus === 'ONGOING' ? " ongoing" : list.status === "COMPLETED" ? ' completed' : ' need report'),
//       time: { start: useIsoToLocalTimeFormat(list.startTime!), end: useIsoToLocalTimeFormat(list.endTime!) },
//       color: diffStatus === 'UPCOMING' ? 'blue' : diffStatus === 'ONGOING' ? "yellow" : list.status === "COMPLETED" ? 'green' : 'red'
//     }
//   })
// })
// const config = ref({ defaultMode: 'month', locale: 'id-ID' });
const router = useRouter();
const toAssignmentPage = (tab: string) => router.push(`/sales-striking-assignment/?tab=${tab}`)
const toActivityPage = (tab: string) => router.push(`/sales-activity/?tab=${tab}`)

// const periodUpdated = (period: { start: string, end: string }) => {
//   console.log(new Date(period.start).getDate())
// }

onMounted(async () => {
  type ReponseType = {
    // salesActivityScheduleSummaryList: SalesActivityScheduleSummaryType[];
    upcomingScheduleCount: number;
    pastScheduleCount: number;
    newAssignment: number;
    idleAssignment: number;
  }
  const response = await salesRepository.getUser()
    .executeSalesGraphqlQuery<ReponseType>([
      // {
      //   operation: "salesActivityScheduleSummaryList",
      //   variables: {},
      //   fields: ["total", "startTime", "endTime", "status"],
      // },
      {
        operation: { name: "totalSalesActivitySchedule", alias: "upcomingScheduleCount" },
        variables: {
          upcomingScheduleFilters: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "SalesActivitySchedule.startTime", value: new Date().toISOString(), comparisonType: 'GTE' },
              { column: "SalesActivitySchedule.status", value: SalesActivityScheduleStatus.SCHEDULED },
            ],
          }
        },
        fields: []
      },
      {
        operation: { name: "totalSalesActivitySchedule", alias: "pastScheduleCount" },
        variables: {
          pastScheduleFilters: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "SalesActivitySchedule.endTime", value: new Date().toISOString(), comparisonType: 'LTE' },
              { column: "SalesActivitySchedule.status", value: SalesActivityScheduleStatus.SCHEDULED },
            ],
          }
        },
        fields: []
      },
      {
        operation: { name: "totalStrikingAssignment", alias: "newAssignment" },
        variables: {
          newAssignmentFilters: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "StrikingAssignment.status", value: 'ACTIVE' },
              { column: "hasSalesActivitySchedule", value: false },
            ],
          }
        },
        fields: []
      },
      {
        operation: { name: "totalStrikingAssignment", alias: "idleAssignment" },
        variables: {
          assignmentWithoutActiveScheduleFilters: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "StrikingAssignment.status", value: CustomerAssignmentStatus.ACTIVE },
              { column: "hasSalesActivitySchedule", value: true },
              { column: "hasActiveSalesActivitySchedule", value: false },
            ],
          }
        },
        fields: []
      },
    ])
  // salesActivityScheduleSummaryList.value = response.salesActivityScheduleSummaryList
  upcomingScheduleCount.value = response.upcomingScheduleCount
  pastScheduleCount.value = response.pastScheduleCount
  newAssignment.value = response.newAssignment
  idleAssignment.value = response.idleAssignment
})

</script>

<script lang="ts">
export default {
  name: 'StrikerDashboard',
}
</script>

<style>
@import "qalendar/dist/style.css";
</style>