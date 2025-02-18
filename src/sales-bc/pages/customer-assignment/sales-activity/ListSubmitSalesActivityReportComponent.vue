<template>
  <div>
    <ProgressSpinner v-if="fetchingInitialData" />
    <div v-else fluid class="flex flex-col gap-4">
      <SalesActivityReportComponent :sales-activity-report="salesActivityReport" />
      <FloatLabel variant="on">
        <Select
          v-model="selectedCustomerJourney"
          inputId="customerJourney"
          :options="customerJourneyList"
          optionLabel="name"
          fluid
        />
        <label for="customerJourney">Update Customer Journey</label>
      </FloatLabel>
      <div class="flex justify-end">
        <Button
          :disabled="!salesActivityReport.isValidToSubmit()"
          :loading="submittingReportAndJourney"
          label="submit"
          @click="submitReportAndJourney"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CustomerJourneyType } from "@/company-bc/domain/model/customer-journey";
import { useCustomerJourneyStore } from "@/company-bc/stores/customer-journey-store";
import CustomerAssignment, {
  CustomerAssignmentType,
} from "@/sales-bc/domain/model/sales/customer-assignment";
import SalesActivityReport, {
  SalesActivityReportType,
} from "@/sales-bc/domain/model/sales/customer-assignment/sales-activity-schedule/sales-activity-report";
import SalesActivityReportComponent from "@/sales-bc/domain/model/sales/customer-assignment/sales-activity-schedule/SalesActivityReportComponent.vue";
import { SalesActivityScheduleType } from "@/sales-bc/domain/model/sales/customer-assignment/salesActivitySchedule";
import CustomerAssignmentService from "@/sales-bc/domain/service/customer-assignment-service";
import SalesActivityReportService from "@/sales-bc/domain/service/sales-activity-report-service";
import { useCustomerAssignmentStore } from "@/sales-bc/stores/customer-assignment-store";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { onMounted, reactive, ref } from "vue";

const props = defineProps<{
  customerAssignmentId: string;
  salesActivitySchedule: SalesActivityScheduleType;
}>();
const emit = defineEmits<{ (e: "reportSubmitted", report: SalesActivityReportType): void }>();
const salesActivityReport = reactive(
  new SalesActivityReport({ salesActivitySchedule: props.salesActivitySchedule })
);
const { salesRepository } = useDependencyInjection();

const customerAssignmentStore = useCustomerAssignmentStore();
const customerAssignment = ref<CustomerAssignment>();

const customerJourneyStore = useCustomerJourneyStore();
const customerJourneyList = ref<CustomerJourneyType[]>();
const selectedCustomerJourney = ref<CustomerJourneyType>();

const fetchingInitialData = ref(true);
onMounted(async () => {
  customerAssignment.value = await customerAssignmentStore.getCustomerAssignment(
    props.customerAssignmentId
  );
  customerJourneyList.value = await customerJourneyStore.fecthAllActiveCustomerJourneyList();
  selectedCustomerJourney.value = customerAssignment.value.customerJourney;
  //
  fetchingInitialData.value = false;
});

const submittingReportAndJourney = ref(false);
const submitReportAndJourney = async () => {
  const operations = [
    SalesActivityReportService.buildSubmitScheduledSalesActivityReportGraphqlOptions(
      salesActivityReport
    ),
    CustomerAssignmentService.buildUpdateCustomerAssignmentJourneyGraphqlOptions(
      props.customerAssignmentId,
      selectedCustomerJourney.value?.id!
    ),
  ];
  submittingReportAndJourney.value = true;
  const response = await salesRepository.getUser().executeSalesGraphqlMutation<{
    submitSalesActivityReport: SalesActivityReportType;
    updateCustomerAssignmentJourney: CustomerAssignmentType;
  }>(operations);

  customerAssignment.value!.customerJourney =
    response.updateCustomerAssignmentJourney.customerJourney!;
  submittingReportAndJourney.value = false;
  emit("reportSubmitted", response.submitSalesActivityReport);
};
</script>

<style scoped></style>
