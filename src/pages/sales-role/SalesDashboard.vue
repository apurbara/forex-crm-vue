<template>
  <h1 class="page-title">Sales Dashboard</h1>
  <!-- <section>
      <h2>Target Realization</h2>
      <div>
        <v-progress-linear model-value="45" color="light-green" height="25">
          <template v-slot:default="{ value }">
            <strong>45 / 100</strong>
          </template>
        </v-progress-linear>
      </div>
    </section> -->
  <section class="page-section ma-2 calendar-container is-light-mode">
    <Qalendar :events="calendarSchedules" :config="config" />
  </section>

  <div class="d-flex justify-space-between wrap">
    <section class="page-section ma-2" style="min-width: 48%;">
      <h2 class="section-title">Upcoming Activities</h2>
      <p v-if="upcomingActivitySchedules.length < 1">
        You dont have any activity plan
      </p>
      <v-card v-else variant="tonal" v-for="(upcomingSchedule, key) in upcomingActivitySchedules"
        :key="upcomingSchedule.id ?? key" class="d-flex justify-space-between align-center ma-2 px-1"
        :to="`/assigned-customer/${upcomingSchedule.assignedCustomer?.id}`">
        <div class="d-flex justify-start align-center">
          <v-card-title class="flex-grow-0 flex-shrink-0" style="width: 200px;">
            <p>{{ upcomingSchedule.assignedCustomer?.customer?.name }}</p>
            <v-chip>{{ upcomingSchedule.assignedCustomer?.customer?.area?.name }}</v-chip>
            <v-chip>{{ upcomingSchedule.assignedCustomer?.customerJourney?.name }}</v-chip>
          </v-card-title>
          <v-card-text class="flex-grow-1 flex-shrink-1" style="min-width: 200px;">
            <p>{{ limitString(String(upcomingSchedule.salesActivity?.name), 30) }}</p>
            <v-chip>{{ upcomingSchedule.startTime }}</v-chip>
          </v-card-text>
        </div>
      </v-card>
    </section>
    <section class="page-section ma-2" style="min-width: 48%;">
      <h2 class="section-title">Report Required</h2>
      <p v-if="reportRequiredActivitySchedules.length < 1">
        You have completed all reports for past activities
      </p>
      <v-card v-else variant="tonal" v-for="(reportRequiredActivity, key) in reportRequiredActivitySchedules"
        :key="reportRequiredActivity.id ?? key" class="d-flex justify-space-between align-center my-1 px-1"
        :to="`/assigned-customer/${reportRequiredActivity.assignedCustomer?.id}`">
        <div class="d-flex justify-start align-center">
          <v-card-title class="flex-grow-0 flex-shrink-0" style="width: 200px;">
            <p>{{ reportRequiredActivity.assignedCustomer?.customer?.name }}</p>
            <v-chip>{{ reportRequiredActivity.assignedCustomer?.customer?.area?.name }}</v-chip>
            <v-chip>{{ reportRequiredActivity.assignedCustomer?.customerJourney?.name }}</v-chip>
          </v-card-title>
        </div>
        <v-card-text class="flex-grow-1 flex-shrink-1" style="min-width: 200px;">
          <p>{{ limitString(String(reportRequiredActivity.salesActivity?.name), 30) }}</p>
          <v-chip>{{ reportRequiredActivity.endTime }}</v-chip>
        </v-card-text>
      </v-card>
    </section>
  </div>

  <section class="page-section ma-2">
    <h2 class="section-title">Assignment Without Plan</h2>
    <div>
      <!-- <pro-calendar /> -->
      <!-- <pro-calendar :loading="false" view="month" @calendarClosed="void 0"
          @fetchEvents="void 0" /> -->
    </div>
  </section>
</template>

<script lang="ts" setup>
// import "vue-pro-calendar/style";
import { ref } from 'vue';
import { useStringLimiter, useIsoToLocalTimeFormat, useTimeIntervalDifferenceCounter } from "@/resources/composables/typography";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import CursorPagination from "@/resources/components/cursor-pagination";
import { SalesActivityScheduleSummaryType, SalesActivityScheduleType } from "@/domain/model/personnel/manager/sales/assigned-customer/sales-activity-schedule";
import SalesRole from "@/domain/user-role/personnel/sales-role";
import { PaginationResponseType } from "@/resources/components/abstract-pagination";
import { onMounted } from "vue";
import { Qalendar } from "qalendar";
import { computed } from "vue";

const { httpRequest, userRepository } = useDependencyInjection()

const upcomingActivitySchedules = ref<SalesActivityScheduleType[]>([])
const reportRequiredActivitySchedules = ref<SalesActivityScheduleType[]>([])
const salesActivityScheduleSummaryList = ref<SalesActivityScheduleSummaryType[]>([])

const calendarSchedules = computed(() => {
  return salesActivityScheduleSummaryList.value.map((list) => {
    const { diffStatus } = useTimeIntervalDifferenceCounter(list.startTime!, list.endTime!)
    return {
      id: list.startTime! + list.status!,
      title: `${list.total} ` + (diffStatus === 'UPCOMING' ? ' upcoming' : diffStatus === 'ONGOING' ? " ongoing" : list.status === "COMPLETED" ? ' completed' : ' need report'),
      time: { start: useIsoToLocalTimeFormat(list.startTime!), end: useIsoToLocalTimeFormat(list.endTime!) },
      color: diffStatus === 'UPCOMING' ? 'blue' : diffStatus === 'ONGOING' ? "orange" : list.status === "COMPLETED" ? 'green' : 'red'
    }
  })
})
const config = ref({
  defaultMode: 'month',
});

onMounted(async () => {
  const currentTime = new Date()
  const currentTimeString = `${currentTime.getFullYear()}-${currentTime.getMonth() + 1}-${currentTime.getDate()} ${currentTime.getHours()}:00:00`
  const response = await userRepository.getUser<SalesRole>()
    .executeSalesGraphqlQuery<{
      upcomingActivies: PaginationResponseType<SalesActivityScheduleType>,
      reportRequiredActivities: PaginationResponseType<SalesActivityScheduleType>,
      salesActivityScheduleSummaryList: SalesActivityScheduleSummaryType[]
    }>(httpRequest, [
      {
        operation: { name: "salesActivityScheduleList", alias: "upcomingActivies" },
        variables: {
          upcomingFilters: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "SalesActivitySchedule.status", value: 'SCHEDULED' },
              { column: "SalesActivitySchedule.endTime", value: currentTimeString, comparisonType: 'GTE' }
            ]
          }
        },
        fields: CursorPagination.wrapResultFields([
          "id", "status", "startTime",
          { assignedCustomer: ["id", { customerJourney: ["name"] }, { customer: ["name", { area: ["name"] }] }] },
          { salesActivity: ["name", "duration"] }
        ])
      },
      {
        operation: { name: "salesActivityScheduleList", alias: "reportRequiredActivities" },
        variables: {
          reportRequiredFilters: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "SalesActivitySchedule.status", value: 'SCHEDULED' },
              { column: "SalesActivitySchedule.endTime", value: currentTimeString, comparisonType: 'LT' }
            ]
          }
        },
        fields: CursorPagination.wrapResultFields([
          "id", "status", "endTime",
          { assignedCustomer: ["id", { customerJourney: ["name"] }, { customer: ["name", { area: ["name"] }] }] },
          { salesActivity: ["name", "duration"] }
        ])
      },
      {
        operation: "salesActivityScheduleSummaryList",
        variables: {},
        // variables: {
        //   summaryFilters: {
        //     type: "[FilterInput]", name: "filters",
        //     value: [
        //       { column: "SalesActivitySchedule.startTime", value: currentTimeString, comparisonType: 'GTE' },
        //       { column: "SalesActivitySchedule.endTime", value: currentTimeString, comparisonType: 'LTE' }
        //     ]
        //   }
        // },
        fields: ["total", "startTime", "endTime", "status"],
      }
    ])
  upcomingActivitySchedules.value = response.upcomingActivies.list
  reportRequiredActivitySchedules.value = response.reportRequiredActivities.list
  salesActivityScheduleSummaryList.value = response.salesActivityScheduleSummaryList
})

const limitString = (string: string, size: number) => useStringLimiter(string, size) 
</script>

<script lang="ts">
export default {
  name: 'SalesDashboard',
}
</script>

<style>
  @import "qalendar/dist/style.css";
</style>