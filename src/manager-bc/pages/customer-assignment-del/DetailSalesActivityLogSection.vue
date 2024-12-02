<template>
  <section class="page-section ma-2">
    <h2 class="section-title">Activity Log</h2>
    <v-table v-if="customerAssignment.salesActivitySchedules?.length ?? 0 > 0" density="compact" style="width: 100%;"
      class="datatable px-2">
      <thead>
        <tr>
          <th>sales activity</th>
          <th>report note</th>
          <th>time</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(activitySchedule, key) in customerAssignment.salesActivitySchedules"
          :key="activitySchedule.id ?? key" :style="activitySchedule.salesActivityReport ? 'background-color: green' : 'background-color: orange'">
          <td>{{ activitySchedule.salesActivity?.name }}</td>
          <td v-if="!activitySchedule.salesActivityReport">
            Not Completed
          </td>
          <td v-else> {{ limitString(activitySchedule.salesActivityReport?.content, 50) }}
            <v-btn v-if="activitySchedule.salesActivityReport?.content?.length! > 50" variant="text"
              icon="mdi-dots-horizontal-circle-outline" size="small"
              @click="showReportContent($event, activitySchedule.salesActivityReport!)"></v-btn>
          </td>
          <!-- <td v-if="activitySchedule.salesActivityReport">{{ new
            Date(activitySchedule.salesActivityReport?.submitTime!).toLocaleString() }}</td> -->
          <td>{{ new Date(activitySchedule.startTime!).toLocaleString("id-ID") }}</td>
        </tr>
      </tbody>
    </v-table>
  </section>

  <OverlayPanel ref="op" showCloseIcon style="width: 600px;">
    <div class="pa-4">{{ selectedReport?.content }}</div>
  </OverlayPanel>

</template>

<script setup lang="ts">
import { CustomerAssignmentType } from '@/manager-bc/domain/model/manager/sales/customer-assignment';
import { SalesActivityReportType } from '@/manager-bc/domain/model/manager/sales/customer-assignment/sales-activity-schedule/sales-activity-report';
import { useStringLimiter } from '@/resources/composables/typography';
import OverlayPanel from 'primevue/overlaypanel';
import { ref } from 'vue';

defineProps<{ customerAssignment: CustomerAssignmentType }>();

const limitString = (string: string | undefined, length: number) => {
  return useStringLimiter(string, length)
}

const op = ref();
const selectedReport = ref<SalesActivityReportType>()
const showReportContent = (event: any, salesActivityReport: SalesActivityReportType) => {
  op.value.toggle(event)
  selectedReport.value = salesActivityReport
}
const initialSalesReportContent = ref<string>("");

</script>

<style scoped></style>