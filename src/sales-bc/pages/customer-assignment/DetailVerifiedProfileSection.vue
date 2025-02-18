<template>
  <section class="page-section">
    <div class="flex justify-between gap-2 align-center mb-1">
      <h2 class="font-semibold mt-1">Customer Profile</h2>
      <Badge
        size="large"
        severity="info"
        :value="customerAssignment.customer?.countTotalVerificationWeight()"
      />
    </div>
    <div v-if="customerAssignment.customer.verificationReports.length > 0">
      <ul class="flex flex-col gap-1">
        <li
          class="text-sm list-disc ml-3"
          v-for="(verificationReport, index) in customerAssignment.customer.verificationReports"
          :key="verificationReport.id ?? index"
        >
          <span>{{ verificationReport.customerVerification?.name }} </span>
          (
          <span
            :class="
              (verificationReport.customerVerification?.weight ?? 1) > 0 ? 'text-green' : 'text-red'
            "
            >{{ verificationReport.customerVerification?.weight }}</span
          >
          )
          {{ verificationReport.note ? ": " : "" }}
          <span class="text-sm text-stone-500">{{ verificationReport.note }}</span>
        </li>
      </ul>
    </div>
    <DataTable
      v-if="unverifiedVerificationList.length > 0"
      :value="unverifiedVerificationList"
      size="small"
      class="w-full text-sm mt-2"
    >
      <Column header="Verifikasi Data">
        <template #body="{ data }">
          <p>
            <span>{{ data.name }} </span> :
            <span class="text-stone-400">{{ data.description }} </span>
          </p>
        </template>
      </Column>
      <Column field="weight" header="Bobot"></Column>
      <Column>
        <template #body="{ data }">
          <div class="flex justify-end gap-2 align-center">
            <Button
              class="!m-0 !p-2 !text-xs"
              icon="pi pi-verified"
              @click="showVerificationReportSubmission(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </section>

  <v-dialog
    v-model="displayVerificationReportSubmissionDialog"
    location-strategy="connected"
    width="600px"
  >
    <div style="background-color: white; border-radius: 4px" class="pa-8">
      <SubmitVerificationReportComponent :verification-report="toSubmitVerifiationReport!" />
      <div class="d-flex justify-end">
        <v-btn
          @click="submitVerificationReport(toSubmitVerifiationReport!)"
          :disabled="throttleReportRequest"
          >submit</v-btn
        >
      </div>
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
import { CustomerVerificationType } from "@/company-bc/domain/model/customer-verification";
import { useCustomerVerificationStore } from "@/company-bc/stores/customer-verification-store";
import CustomerAssignment from "@/sales-bc/domain/model/sales/customer-assignment";
import SubmitVerificationReportComponent from "@/sales-bc/domain/model/sales/customer-assignment/customer/SubmitVerificationReportComponent.vue";
import VerificationReport, {
  VerificationReportType,
} from "@/sales-bc/domain/model/sales/customer-assignment/customer/verification-report";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { computed, onMounted, ref } from "vue";

const props = defineProps<{ customerAssignment: CustomerAssignment }>();
const customerVerificationStore = useCustomerVerificationStore();
const customerVerificationList = ref<CustomerVerificationType[]>();
const { salesRepository } = useDependencyInjection();

onMounted(async () => {
  customerVerificationList.value =
    await customerVerificationStore.fecthAllActiveCustomerVerificationList();
  props.customerAssignment.customer.registerCustomerVerificationReports(
    customerVerificationList.value
  );
});

const displayVerificationReportSubmissionDialog = ref<boolean>(false);
const throttleReportRequest = ref<boolean>(false);
const toSubmitVerifiationReport = ref<VerificationReport>();
const showVerificationReportSubmission = (verificationReport: VerificationReport) => {
  toSubmitVerifiationReport.value = verificationReport;
  displayVerificationReportSubmissionDialog.value = true;
};
const submitVerificationReport = async (verificationReport: VerificationReport) => {
  throttleReportRequest.value = true;
  const response = await salesRepository
    .getUser()
    .executeSalesGraphqlMutation<{ submitCustomerVerificationReport: VerificationReportType }>({
      operation: "submitCustomerVerificationReport",
      variables: {
        CustomerAssignment_id: { type: "ID", required: true, value: props.customerAssignment.id },
        ...verificationReport.toGraphqlVariables(),
      },
      fields: ["id", "note", "createdTime"],
    });
  verificationReport.load(response.submitCustomerVerificationReport);
  displayVerificationReportSubmissionDialog.value = false;
  throttleReportRequest.value = false;
};

const unverifiedVerificationList = computed(() => {
  return (
    customerVerificationList.value?.filter(
      (verification) =>
        !props.customerAssignment.customer.verificationReports.find(
          (el) => el.CustomerVerification_id === verification.id
        )
    ) ?? []
  );
});
</script>

<style scoped></style>
