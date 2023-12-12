<template>
  <h1 class="page-title">Sales Dashboard</h1>
  <section class="page-section ma-2 calendar-container is-light-mode">
    <Qalendar :events="calendarSchedules" :config="config" />
  </section>

  <div class="d-flex justify-space-between wrap">
    <section class="page-section ma-2" style="min-width: 48%;">
      <h2 class="section-title">Upcoming Activities</h2>
      <p v-if="upcomingActivitySchedules.length < 1">
        You dont have any activity plan
      </p>
      <v-card v-else variant="outlined" v-for="(upcomingSchedule, key) in upcomingActivitySchedules"
        :key="upcomingSchedule.id ?? key" class="ma-2"
        :to="`/assigned-customer/${upcomingSchedule.assignedCustomer?.id}`">
        <div class="d-flex flex-wrap justify-start align-center">
          <v-card-title>
            <p class="font-16 font-weight-bold">{{ upcomingSchedule.assignedCustomer?.customer?.name }}</p>
          </v-card-title>
          <v-chip :color="upcomingScheduleTimeColor(upcomingSchedule.startTime!, upcomingSchedule.endTime!)">{{ calculateTimeDiff(upcomingSchedule.startTime!, upcomingSchedule.endTime!) }}</v-chip>
        </div>
        <div class="d-flex flex-wrap justify-start align-center">
          <InfoComponentSmall :info="{label: 'activity', value: upcomingSchedule.salesActivity?.name!, icon: 'mdi-human-greeting-proximity'}" />
          <InfoComponentSmall :info="{label: 'customer journey', value: upcomingSchedule.assignedCustomer?.customerJourney?.name!, icon: 'mdi-progress-star'}" />
        </div>
      </v-card>
    </section>
    <section class="page-section ma-2" style="min-width: 48%;">
      <h2 class="section-title">Report Required</h2>
      <p v-if="reportRequiredActivitySchedules.length < 1">
        You have completed all reports for past activities
      </p>
      <v-card v-else variant="outlined" v-for="(reportRequiredActivity, key) in reportRequiredActivitySchedules"
        :key="reportRequiredActivity.id ?? key" class="ma-2"
        :to="`/assigned-customer/${reportRequiredActivity.assignedCustomer?.id}`">
        <div class="d-flex flex-wrap justify-start align-center">
          <v-card-title>
            <p class="font-16 font-weight-bold">{{ reportRequiredActivity.assignedCustomer?.customer?.name }}</p>
          </v-card-title>
          <v-chip color="red">{{ calculateTimeDiff(reportRequiredActivity.startTime!, reportRequiredActivity.endTime!) }}</v-chip>
        </div>
        <div class="d-flex flex-wrap justify-start align-center">
          <InfoComponentSmall :info="{label: 'activity', value: reportRequiredActivity.salesActivity?.name!, icon: 'mdi-human-greeting-proximity'}" />
          <InfoComponentSmall :info="{label: 'customer journey', value: reportRequiredActivity.assignedCustomer?.customerJourney?.name!, icon: 'mdi-progress-star'}" />
        </div>
      </v-card>
    </section>
  </div>

  <!-- <section class="page-section ma-2">
    <h2 class="section-title">Assignment Without Plan</h2>
    <div>
    </div>
  </section> -->
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
import InfoComponentSmall from '@/shared/components/info-component-small.vue';

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
      color: diffStatus === 'UPCOMING' ? 'blue' : diffStatus === 'ONGOING' ? "yellow" : list.status === "COMPLETED" ? 'green' : 'red'
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
              { column: "SalesActivitySchedule.endTime", value: currentTimeString, comparisonType: 'GT' }
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
              { column: "SalesActivitySchedule.endTime", value: currentTimeString, comparisonType: 'LTE' }
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

const limitString = (string: string, size: number): string => useStringLimiter(string, size)
const calculateTimeDiff = (startTime: string, endTime: string): string => {
  const { differenceDescription } = useTimeIntervalDifferenceCounter(startTime, endTime)
  return differenceDescription;
}
const upcomingScheduleTimeColor = (startTime: string, endTime: string): string => {
  const { diffStatus } = useTimeIntervalDifferenceCounter(startTime, endTime)
  return diffStatus === 'UPCOMING' ? 'blue' : "orange";
}

</script>

<script lang="ts">
export default {
  name: 'SalesDashboard',
}
</script>

<style>
@import "qalendar/dist/style.css";
</style>