<template>
  <section class="page-section">
    <h2 class="section-title">Sales Activity History</h2>
    <p v-if="assignedCustomer.completedSchedules().length < 1">
        No Completed Sales Activity for this Customer
      </p>
    <v-table v-else density="compact" style="width: 100%;" class="datatable px-2">
      <thead>
        <tr>
          <th>time</th>
          <th>sales activity</th>
          <th>report note</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(schedule, key) in assignedCustomer.completedSchedules()" :key="schedule.id ?? key">
          <td>{{ calculateTimeDiff(schedule.startTime, schedule.endTime) }}</td>
          <td>{{ schedule.salesActivity.label.name }}</td>
          <td> {{ limitString(schedule.salesActivityReport.content, 120) }}
            <v-btn v-if="schedule.salesActivityReport.content.length > 120"
            variant="text" icon="mdi-dots-horizontal-circle-outline" size="small"
              @click="showReportContent($event, schedule.salesActivityReport)"></v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </section>

  <OverlayPanel ref="op" showCloseIcon style="width: 600px;">
    <div class="pa-4">{{ selectedReport?.content }}</div>
  </OverlayPanel>
</template>

<script lang="ts" setup>

import OverlayPanel from 'primevue/overlaypanel';

import AssignedCustomer from '@/domain/model/personnel/manager/sales/assigned-customer';
import SalesActivityReport from '@/domain/model/personnel/manager/sales/assigned-customer/sales-activity-schedule/sales-activity-report';
import { ref } from 'vue';
import { useStringLimiter, useTimeIntervalDifferenceCounter } from '@/resources/composables/typography';

const props = defineProps<{ assignedCustomer: AssignedCustomer }>()

const op = ref()
const selectedReport = ref<SalesActivityReport>()

const calculateTimeDiff = (startTime: string, endTime: string) => {
  const { differenceDescription } = useTimeIntervalDifferenceCounter(startTime, endTime)
  return differenceDescription;
}
const limitString = (string: string | undefined, length: number) => {
  return useStringLimiter(string, length)
}

const showReportContent = (event: any, salesActivityReport: SalesActivityReport) => {
  op.value.toggle(event)
  selectedReport.value = salesActivityReport
}

</script>

<style lang="scss" scoped></style>