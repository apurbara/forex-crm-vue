<template>
  <SalesActivityReportComponent :sales-activity-report="salesActivityReport!" />
  <div class="d-flex justify-center">
    <v-btn @click="submit" :disabled="!salesActivityReport.isValidToSubmit()">submit</v-btn>
  </div>
</template>

<script lang="ts" setup>
import SalesActivitySchedule from '@/domain/model/personnel/manager/sales/assigned-customer/sales-activity-schedule';
import SalesActivityReportComponent from '@/domain/model/personnel/manager/sales/assigned-customer/sales-activity-schedule/SalesActivityReportComponent.vue';
import SalesActivityReport, { SalesActivityReportType } from '@/domain/model/personnel/manager/sales/assigned-customer/sales-activity-schedule/sales-activity-report';
import SalesRole from '@/domain/user-role/personnel/sales-role';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { reactive } from 'vue';

const props = defineProps<{ salesActivitySchedule: SalesActivitySchedule }>()
const { httpRequest, userRepository } = useDependencyInjection()
const salesActivityReport = reactive<SalesActivityReport>(new SalesActivityReport(props.salesActivitySchedule))

const submit = async () => {
  const response = await userRepository.getUser<SalesRole>()
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