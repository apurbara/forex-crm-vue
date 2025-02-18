<template>
  <div></div>
</template>

<script setup lang="ts">
import CustomerAssignment from "@/sales-bc/domain/model/sales/customer-assignment";
import SalesActivityReport from "@/sales-bc/domain/model/sales/customer-assignment/sales-activity-schedule/sales-activity-report";
import SalesActivitySchedule from "@/sales-bc/domain/model/sales/customer-assignment/salesActivitySchedule";
import CustomerAssignmentService from "@/sales-bc/domain/service/customer-assignment-service";
import SalesActivityReportService from "@/sales-bc/domain/service/sales-activity-report-service";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { reactive, ref } from "vue";

const props = defineProps<{ customerAssignment: CustomerAssignment }>();
const { salesRepository } = useDependencyInjection();

const salesActivitySchedule = reactive(new SalesActivitySchedule());
const salesActivityReport = reactive(new SalesActivityReport());
salesActivityReport.salesActivitySchedule = salesActivitySchedule;
salesActivitySchedule.salesActivityReport = salesActivityReport;

const salesActivityReportService = new SalesActivityReportService(salesRepository.getUser());
const customerAssignmentService = new CustomerAssignmentService(salesRepository.getUser());

const submittingNonScheduleSalesActivityReport = ref(false);
const submitNonScheduleSalesActivityReport = async () => {
  const response = await salesActivityReportService.submitNonScheduleSalesActivityReport(
    salesActivityReport,
    props.customerAssignment.id!
  );
  salesActivitySchedule.load(response);
  props.customerAssignment.salesActivitySchedules.unshift(salesActivitySchedule);
  //
  submittingNonScheduleSalesActivityReport.value = false;
};
</script>

<style scoped></style>
