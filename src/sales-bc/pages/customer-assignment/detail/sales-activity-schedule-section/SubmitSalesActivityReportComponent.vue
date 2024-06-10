<template>
  <SalesActivityReportComponent :sales-activity-report="salesActivityReport!" />
  <div class="d-flex justify-center">
    <v-btn @click="submit" :disabled="!salesActivityReport.isValidToSubmit()">submit</v-btn>
  </div>
</template>

<script lang="ts" setup>
import SalesActivitySchedule from '@/sales-bc/domain-old/model/sales/customer-assignment/sales-activity-schedule';
import SalesActivityReportComponent from '@/sales-bc/domain-old/model/sales/customer-assignment/sales-activity-schedule/SalesActivityReportComponent.vue';
import SalesActivityReport, { SalesActivityReportType } from '@/sales-bc/domain-old/model/sales/customer-assignment/sales-activity-schedule/sales-activity-report';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { reactive } from 'vue';

const props = defineProps<{ salesActivitySchedule: SalesActivitySchedule }>()
const { httpRequest, salesRepository } = useDependencyInjection()
const salesActivityReport = reactive<SalesActivityReport>(new SalesActivityReport(props.salesActivitySchedule))

const submit = async () => {
  const response = await salesRepository.getUser()
    .executeSalesGraphqlMutation<{ submitSalesActivitySchedule: SalesActivityReportType }>(httpRequest, {
      operation: "submitSalesActivitySchedule",
      variables: {
        SalesActivitySchedule_id: { type: "ID", required: true, value: salesActivityReport.id },
        ...salesActivityReport.toGraphqlVariables(),
      },
    })
  salesActivityReport.load(response.submitSalesActivitySchedule)
}
</script>

<style lang="scss" scoped></style>