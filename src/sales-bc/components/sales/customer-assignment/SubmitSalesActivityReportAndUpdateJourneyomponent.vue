<template>
  <div v-if="fetchingCustomerJouneyData">
    <ProgressSpinner />
  </div>
  <div v-else>
    <SalesActivityReportComponent :sales-activity-report="salesActivityReport" />
    <p class="font-16 mb-2">update customer journey</p>
    <v-select
      :items="customerJourneyList"
      item-title="name"
      return-object
      v-model="customerAssignment.customerJourney"
    />
    <div class="flex justify-end ma-6">
      <Button
        label="Submit"
        @click="submitReportAndUpdateJourney"
        :disabled="!salesActivityReport.isValidToSubmit()"
        :loading="submittingReportAndJourney"
      />
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { CustomerJourneyType } from "@/company-bc/domain/model/customer-journey";
import { SalesActivityType } from "@/company-bc/domain/model/sales-activity";
import { useCustomerJourneyStore } from "@/company-bc/stores/customer-journey-store";
import { useSalesActivityStore } from "@/company-bc/stores/sales-activity-store";
import { GraphqlBuilderOptions } from "@/resources/types/graphql";
import CustomerAssignment, {
  CustomerAssignmentType,
} from "@/sales-bc/domain/model/sales/customer-assignment";
import SalesActivityReport, {
  SalesActivityReportType,
} from "@/sales-bc/domain/model/sales/customer-assignment/sales-activity-schedule/sales-activity-report";
import SalesActivityReportComponent from "@/sales-bc/domain/model/sales/customer-assignment/sales-activity-schedule/SalesActivityReportComponent.vue";
import SalesActivitySchedule from "@/sales-bc/domain/model/sales/customer-assignment/salesActivitySchedule";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { onMounted, reactive, ref } from "vue";

const props = defineProps<{
  customerAssignment: CustomerAssignment;
  salesActivitySchedule: SalesActivitySchedule;
}>();
const currentJourneyId: string = props.customerAssignment.customerJourney.id!;
const salesActivityReport = reactive(new SalesActivityReport());
salesActivityReport.salesActivitySchedule = props.salesActivitySchedule;

const customerJourneyStore = useCustomerJourneyStore();
const salesActivityStore = useSalesActivityStore();
const customerJourneyList = ref<CustomerJourneyType[]>();
const salesActivityList = ref<SalesActivityType[]>();
const fetchingCustomerJouneyData = ref(true);
onMounted(async () => {
  customerJourneyList.value = await customerJourneyStore.fecthAllActiveCustomerJourneyList();
  if (!salesActivityReport.salesActivitySchedule?.salesActivity) {
    salesActivityList.value = await salesActivityStore.fecthAllActiveSalesActivityList();
  }
  //
  fetchingCustomerJouneyData.value = false;
});

const { salesRepository } = useDependencyInjection();
const submittingReportAndJourney = ref(false);
const submitReportAndUpdateJourney = async () => {
  submittingReportAndJourney.value = true;

  const operations: GraphqlBuilderOptions[] = [
    {
      operation: "submitSalesActivityReport",
      variables: {
        SalesActivitySchedule_id: {
          type: "ID",
          required: true,
          value: salesActivityReport.salesActivitySchedule?.id,
        },
        ...salesActivityReport.toGraphqlVariables(),
      },
      fields: ["id", "submitTime", "content", { salesActivitySchedule: ["status"] }],
    },
  ];

  if (currentJourneyId !== props.customerAssignment.customerJourney.id) {
    operations.push({
      operation: "updateCustomerAssignmentJourney",
      variables: {
        id: { type: "ID", required: true, value: props.customerAssignment.id },
        CustomerJourney_id: {
          type: "ID",
          required: true,
          value: props.customerAssignment.customerJourney?.id,
        },
      },
      fields: [{ customerJourney: ["id", "name", "description", "initial"] }],
    });
  }
  const response = await salesRepository.getUser().executeSalesGraphqlMutation<{
    submitSalesActivityReport: SalesActivityReportType;
    updateCustomerAssignmentJourney?: CustomerAssignmentType;
  }>(operations);
  salesActivityReport.load(response.submitSalesActivityReport);
  props.salesActivitySchedule.salesActivityReport = salesActivityReport;
  if (response.updateCustomerAssignmentJourney?.customerJourney) {
    props.customerAssignment.customerJourney =
      response.updateCustomerAssignmentJourney.customerJourney;
  }
  //
  submittingReportAndJourney.value = false;
};
</script>

<style scoped></style>
