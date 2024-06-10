<template>
  <h1 class="page-title">Sales Dashboard</h1>
  <SalesDashboardMetricComponent />
  <div class="d-flex justify-space-between flex-wrap">
    <v-card class="pa-4 ma-2" @click="toSchedulePage('upcomingSchedule')">
      <v-card-title>{{ upcomingScheduleCount }}</v-card-title>
      <v-card-subtitle>upcoming schedule</v-card-subtitle>
    </v-card>
    <v-card class="pa-4 ma-2" @click="toSchedulePage('pastSchedule')">
      <v-card-title>{{ pastScheduleCount }}</v-card-title>
      <v-card-subtitle>past schedule</v-card-subtitle>
    </v-card>
    <v-card class="pa-4 ma-2" @click="toAssignmentPage('newAssignment')">
      <v-card-title>{{ newAssignment }}</v-card-title>
      <v-card-subtitle>new assignment</v-card-subtitle>
    </v-card>
    <v-card class="pa-4 ma-2" @click="toAssignmentPage('idleAssignment')">
      <v-card-title>{{ idleAssignment }}</v-card-title>
      <v-card-subtitle>idle assignment</v-card-subtitle>
    </v-card>
  </div>
  <section class="page-section ma-2 calendar-container is-light-mode">
    <Qalendar :events="calendarSchedules" :config="config" />
  </section>
</template>

<script lang="ts" setup>
// import "vue-pro-calendar/style";
import { useIsoToLocalTimeFormat, useTimeIntervalDifferenceCounter } from "@/resources/composables/typography";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { Qalendar } from "qalendar";
import { SalesActivityScheduleSummaryType, SalesActivityScheduleType } from "../domain-old/model/sales/customer-assignment/sales-activity-schedule";
import { computed, onMounted, ref } from "vue";
import SalesDashboardMetricComponent from "./SalesDashboardMetricComponent.vue";
import { SalesActivityScheduleStatus } from "@/shared-bc/domain/enum/sales-activity-schedule-status";
import { CustomerAssignmentStatus } from "@/shared-bc/domain/enum/customer-assignment-status";
import { useRouter } from "vue-router";

const { httpRequest, salesRepository } = useDependencyInjection()
const salesActivityScheduleSummaryList = ref<SalesActivityScheduleSummaryType[]>([])
const upcomingScheduleCount = ref<number>(0)
const pastScheduleCount = ref<number>(0)
const newAssignment = ref<number>(0)
const idleAssignment = ref<number>(0)

const calendarSchedules = computed(() => {
  return salesActivityScheduleSummaryList.value.map((list) => {
    const { diffStatus } = useTimeIntervalDifferenceCounter(list.startTime!, list.endTime!)
    return {
      id: list.startTime! + list.status!,
      title: `${list.total} ` + (diffStatus === 'UPCOMING' ? ' upcoming' : diffStatus === 'ONGOING' ? " ongoing" : list.status === "COMPLETED" ? ' completed' : ' need report'),
      time: { start: useIsoToLocalTimeFormat(list.startTime!), end: useIsoToLocalTimeFormat(list.endTime!) },
      color: diffStatus === 'UPCOMING' ? 'blue' : diffStatus === 'ONGOING' ? "yellow" : list.status === "COMPLETED" ? 'green' : 'red'
    }
  })
})
const config = ref({ defaultMode: 'month' });
const router = useRouter();
const toAssignmentPage = (tab: string) => router.push(`/sales-customer-assignment/?tab=${tab}`)
const toSchedulePage = (tab: string) => router.push(`/schedule/?tab=${tab}`)

onMounted(async () => {
  type ReponseType = {
    salesActivityScheduleSummaryList: SalesActivityScheduleSummaryType[];
    upcomingScheduleCount: number;
    pastScheduleCount: number;
    newAssignment: number;
    idleAssignment: number;
  }
  const response = await salesRepository.getUser()
    .executeSalesGraphqlQuery<ReponseType>(httpRequest, [
      {
        operation: "salesActivityScheduleSummaryList",
        variables: {},
        fields: ["total", "startTime", "endTime", "status"],
      },
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
        operation: { name: "totalCustomerAssignment", alias: "newAssignment" },
        variables: {
          newAssignmentFilters: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "CustomerAssignment.status", value: 'ACTIVE' },
              { column: "newAssignment", value: true },
            ],
          }
        },
        fields: []
      },
      {
        operation: { name: "totalCustomerAssignment", alias: "idleAssignment" },
        variables: {
          assignmentWithoutActiveScheduleFilters: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "CustomerAssignment.status", value: CustomerAssignmentStatus.ACTIVE },
              { column: "newAssignment", value: false },
              { column: "hasActiveSalesActivitySchedule", value: false },
            ],
          }
        },
        fields: []
      },
    ])
  salesActivityScheduleSummaryList.value = response.salesActivityScheduleSummaryList
  upcomingScheduleCount.value = response.upcomingScheduleCount
  pastScheduleCount.value = response.pastScheduleCount
  newAssignment.value = response.newAssignment
  idleAssignment.value = response.idleAssignment
})

</script>

<script lang="ts">
export default {
  name: 'SalesDashboard',
}
</script>

<style>
@import "qalendar/dist/style.css";
</style>