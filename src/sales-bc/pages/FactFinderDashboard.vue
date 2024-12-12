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
  <FactFinderDashboardMetricComponent />
  <SalesDashboardCalendarSection />
</template>

<script lang="ts" setup>
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { onMounted, ref } from "vue";
import { SalesActivityScheduleStatus } from "@/shared-bc/domain/enum/sales-activity-schedule-status";
import { CustomerAssignmentStatus } from "@/shared-bc/domain/enum/customer-assignment-status";
import { useRouter } from "vue-router";
import NotificationCardComponent from "@/shared/components/NotificationCardComponent.vue";
import SalesDashboardCalendarSection from "./SalesDashboardCalendarSection.vue";
import FactFinderDashboardMetricComponent from "./FactFinderDashboardMetricComponent.vue";

const { salesRepository } = useDependencyInjection()
const upcomingScheduleCount = ref<number>(0)
const pastScheduleCount = ref<number>(0)
const newAssignment = ref<number>(0)
const idleAssignment = ref<number>(0)

const router = useRouter();
const toAssignmentPage = (tab: string) => router.push(`/sales-fact-finding-assignment/?tab=${tab}`)
const toActivityPage = (tab: string) => router.push(`/sales-activity/?tab=${tab}`)

onMounted(async () => {
  type ReponseType = {
    upcomingScheduleCount: number;
    pastScheduleCount: number;
    newAssignment: number;
    idleAssignment: number;
  }
  const response = await salesRepository.getUser()
    .executeSalesGraphqlQuery<ReponseType>([
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
        operation: { name: "totalFactFindingAssignment", alias: "newAssignment" },
        variables: {
          newAssignmentFilters: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "FactFindingAssignment.status", value: 'ACTIVE' },
              { column: "hasSalesActivitySchedule", value: false },
            ],
          }
        },
        fields: []
      },
      {
        operation: { name: "totalFactFindingAssignment", alias: "idleAssignment" },
        variables: {
          assignmentWithoutActiveScheduleFilters: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "FactFindingAssignment.status", value: CustomerAssignmentStatus.ACTIVE },
              { column: "hasSalesActivitySchedule", value: true },
              { column: "hasActiveSalesActivitySchedule", value: false },
            ],
          }
        },
        fields: []
      },
    ])
  upcomingScheduleCount.value = response.upcomingScheduleCount
  pastScheduleCount.value = response.pastScheduleCount
  newAssignment.value = response.newAssignment
  idleAssignment.value = response.idleAssignment
})

</script>

<script lang="ts">
export default {
  name: 'FactFinderDashboard',
}
</script>

<style>
@import "qalendar/dist/style.css";
</style>