<template>
  <div>
    <h1 class="page-title">Sales Activity Schedule Detail</h1>
    <div class="form">
      <div>
        <p>status: {{ schedule.status }}</p>
        <p>time: {{ schedule.startTime }} - {{ schedule.endTime }}</p>
        <p>Customer Information</p>
        <p>name: {{ schedule.assignedCustomer.customer.name }}</p>
        <p>email: {{ schedule.assignedCustomer.customer.email }}</p>
        <p>area: {{ schedule.assignedCustomer.customer.area.label.name }}</p>
      </div>
    </div>
    <section class="page-section">
      <h2>Report</h2>
      <SubmitSalesActivityReportComponent :sales-activity-report="salesActivityReport" />
      <div class="d-flex justify-end">
        <v-btn @click="submit" :disabled="!salesActivityReport.isValidToSubmit()">Submit Report</v-btn>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import SalesActivitySchedule, { SalesActivityScheduleType } from '@/domain/model/personnel/manager/sales/assigned-customer/sales-activity-schedule';
import SubmitSalesActivityReportComponent from '@/domain/model/personnel/manager/sales/assigned-customer/sales-activity-schedule/SubmitSalesActivityReportComponent.vue';
import SalesActivityReport, { SalesActivityReportType } from '@/domain/model/personnel/manager/sales/assigned-customer/sales-activity-schedule/sales-activity-report';
import SalesRole from '@/domain/user-role/personnel/sales-role';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted } from 'vue';
import { reactive } from 'vue';

const { httpRequest, userRepository, cache } = useDependencyInjection();

const schedule = reactive(new SalesActivitySchedule())
const props = defineProps<{ scheduleId: string }>()
const salesActivityReport = reactive(new SalesActivityReport())

onMounted(async () => {
  const cacheData = cache?.pull<SalesActivityScheduleType>(`schedule-${props.scheduleId}`);
  if (cacheData) {
    schedule.load(cacheData);
  } else {
    const response = await userRepository?.getUser<SalesRole>()
      .executeSalesGraphqlQuery<{ salesActivityScheduleDetail: SalesActivityScheduleType }>(httpRequest, {
        operation: 'salesActivityScheduleDetail',
        variables: { salesActivityScheduleId: { type: 'ID!', value: props.scheduleId } },
        fields: [
          'id', 'status', 'startTime', 'endTime',
          { assignedCustomer: ["id", { customer: ["id", "name", "email", { area: ["name"] }] },] },
          { salesActivity: ["id", "name", "description", "duration"] }
        ],
      })
    schedule.load(response.salesActivityScheduleDetail)
  }
})

const submit = async () => {
  const response = await userRepository.getUser<SalesRole>()
    .executeSalesGraphqlMutation<{ salesActivitySchedule: { submitReport: SalesActivityReportType } }>(httpRequest, {
      operation: "salesActivitySchedule",
      variables: { salesActivityScheduleId: { type: "ID", required: true, value: schedule.id } },
      fields: [{
        operation: "submitReport",
        variables: salesActivityReport.toGraphqlVariables(),
        fields: ["id", "submitTime", "content"]
      }]
    })
}

</script>

<style lang="scss" scoped></style>