<template>
  <!-- <section class="page-section ma-2"> -->
    <div class="d-flex justify-space-between">
      <h2 class="section-title">Customer Verification</h2>
      <v-chip>{{ factFindingAssignment.customerAssignment.customer?.countTotalVerificationWeight() }}</v-chip>
    </div>
    <div v-if="factFindingAssignment.customerAssignment.customer.getVerifiedReportList().length > 0" class="ma-4">
      <ul>
        <li
          v-for="(verificationReport, index) in factFindingAssignment.customerAssignment.customer.getVerifiedReportList()"
          :key="verificationReport.id ?? index">
          {{ verificationReport.customerVerification?.name }} {{ verificationReport.note ? `:
          ${verificationReport.note}` : `` }}
        </li>
      </ul>
    </div>
    <v-table density="compact" style="width: 100%;" class="datatable px-2"
      v-if="factFindingAssignment.customerAssignment.customer.getUnverifiedReportList().length > 0">
      <thead>
        <tr>
          <th>desciption</th>
          <th>bobot</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(verificationReport, index) in factFindingAssignment.customerAssignment.customer.getUnverifiedReportList()"
          :key="verificationReport.id ?? index">
          <td>
            <p class="font-14">{{ limitString(verificationReport.customerVerification?.name, 30) }}</p>
            <p class="font-12">{{ limitString(verificationReport.customerVerification?.description, 40) }}</p>
          </td>
          <td>
            <p class="font-14">{{ verificationReport.customerVerification?.weight }}</p>
          </td>
          <td>
            <v-btn variant="text" icon="mdi-cloud-upload-outline" size="small"
              @click="showVerificationReportSubmission(verificationReport)"></v-btn>
            <v-btn variant="text" icon="mdi-check-circle-outline" size="small"
              @click="submitVerificationReport(verificationReport)"></v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  <!-- </section> -->

  <v-dialog v-model="displayVerificationReportSubmissionDialog" location-strategy="connected" width="600px">
    <div style="background-color: white; border-radius: 4px;" class="pa-8">
      <SubmitVerificationReportComponent :verification-report="toSubmitVerifiationReport!" />
      <div class="d-flex justify-end">
        <v-btn @click="submitVerificationReport(toSubmitVerifiationReport!)"
          :disabled="throttleReportRequest">submit</v-btn>
      </div>
    </div>
  </v-dialog>

</template>

<script setup lang="ts">
import { CustomerVerificationType } from '@/company-bc/domain/model/customer-verification';
import { VerificationReportType } from '@/company-bc/domain/model/customer/verification-report';
import { useStringLimiter } from '@/resources/composables/typography';
import SubmitVerificationReportComponent from '@/sales-bc/domain/model/sales/customer-assignment/customer/SubmitVerificationReportComponent.vue';
import VerificationReport from '@/sales-bc/domain/model/sales/customer-assignment/customer/verification-report';
import FactFindingAssignment from '@/sales-bc/domain/model/sales/fact-finding-assignment';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, ref } from 'vue';

const props = defineProps<{ factFindingAssignment: FactFindingAssignment }>();
const { companyUserRepository, salesRepository } = useDependencyInjection();

onMounted(async () => {
  const response = await companyUserRepository.getUser()!
    .executeGraphqlQueryInCompany<{ viewAllActiveCustomerVerification: CustomerVerificationType[] }>({
      operation: "viewAllActiveCustomerVerification",
      variables: { filters: { type: "[FilterInput]", value: [{ column: "CustomerVerification.disabled", value: false }] } },
      fields: ["id", "disabled", "weight", "position", "name", "description"],
    });
  props.factFindingAssignment.customerAssignment.customer.registerCustomerVerificationReports(response.viewAllActiveCustomerVerification);
})

const displayVerificationReportSubmissionDialog = ref<boolean>(false)
const throttleReportRequest = ref<boolean>(false)
const toSubmitVerifiationReport = ref<VerificationReport>()
const showVerificationReportSubmission = (verificationReport: VerificationReport) => {
  toSubmitVerifiationReport.value = verificationReport;
  displayVerificationReportSubmissionDialog.value = true
}
const submitVerificationReport = async (verificationReport: VerificationReport) => {
  throttleReportRequest.value = true;
  const response = await salesRepository.getUser()
    .executeSalesGraphqlMutation<{ submitCustomerVerificationReport: VerificationReportType }>({
      operation: "submitCustomerVerificationReport",
      variables: {
        FactFindingAssignment_id: { type: "ID", required: true, value: props.factFindingAssignment.customerAssignment.id },
        ...verificationReport.toGraphqlVariables(),
      },
      fields: ["id", "note", "createdTime"],
    })
  verificationReport.load(response.submitCustomerVerificationReport);
  displayVerificationReportSubmissionDialog.value = false;
  throttleReportRequest.value = false;

}

const limitString = (string: string | undefined, length: number) => {
  return useStringLimiter(string, length)
}
</script>

<style scoped></style>