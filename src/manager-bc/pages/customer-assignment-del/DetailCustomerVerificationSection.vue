<template>
  <section class="page-section ma-2">
    <div class="d-flex justify-space-between">
      <h2 class="section-title">Customer Verification</h2>
      <v-chip>{{ countTotalVerificationWeight() }}</v-chip>
    </div>
    <div v-if="customerAssignment.customer?.verificationReports?.length ?? 0 > 0" class="ma-4">
      <ul>
        <li v-for="(verificationReport, index) in customerAssignment.customer?.verificationReports"
          :key="verificationReport.id ?? index">
          {{ verificationReport.customerVerification?.name }} {{ verificationReport.note ? `:
          ${verificationReport.note}` : `` }}
        </li>
      </ul>
    </div>
    <div class="font-14">Unverified:</div>
    <v-table density="compact" style="width: 100%;" class="datatable px-2" v-if="getUnverifiedReportList().length > 0">
      <thead>
        <tr>
          <th>desciption</th>
          <th>bobot</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(customerVerification, index) in getUnverifiedReportList()" :key="customerVerification.id ?? index">
          <td>
            <p class="font-12">{{ limitString(customerVerification.name, 30) }}</p>
            <p class="font-12">{{ limitString(customerVerification.description, 40) }}</p>
          </td>
          <td>
            <p class="font-14">{{ customerVerification.weight }}</p>
          </td>
        </tr>
      </tbody>
    </v-table>
  </section>
</template>

<script setup lang="ts">
import { CustomerVerificationType } from '@/company-bc/domain/model/customer-verification';
import { CustomerAssignmentType } from '@/manager-bc/domain/model/manager/sales/customer-assignment';
import { useStringLimiter } from '@/resources/composables/typography';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { useCustomerVerificationStore } from '@/store/customer-verification';
import { onMounted, ref } from 'vue';

const props = defineProps<{ customerAssignment: CustomerAssignmentType }>();
const { companyUserRepository, salesRepository } = useDependencyInjection();
const customerVerificationList = ref<CustomerVerificationType[]>([])
// const customerVerificationList = await useCustomerVerificationStore().getAllActiveCustomerVerificationList

const countTotalVerificationWeight = () => {
  const initialValue = 0;
  return props.customerAssignment.customer?.verificationReports?.reduce(
    (accumulator, verificationReport) => accumulator + (verificationReport.customerVerification?.weight ?? 0),
    initialValue,
  );
}

// const countVerificationReportWeight = (verificationReport: VerificationReportType): number => {
//   return customerVerificationList.value
//     .find((customerVerification) => customerVerification.id === verificationReport.CustomerVerification_id)
//     ?.weight ?? 0
// }

const getUnverifiedReportList = (): CustomerVerificationType[] => {
  return customerVerificationList.value.filter((customerVerification) =>
    !props.customerAssignment.customer?.verificationReports?.find(
      (verificationReport) =>
        verificationReport.customerVerification?.id == customerVerification.id
    )
  );
}

onMounted(async () => {
  customerVerificationList.value = (await useCustomerVerificationStore().getAllActiveCustomerVerificationList).value

  // const response = await companyUserRepository.getUser()!
  //   .executeGraphqlQueryInCompany<{ viewAllActiveCustomerVerification: CustomerVerificationType[] }>({
  //     operation: "viewAllActiveCustomerVerification",
  //     variables: { filters: { type: "[FilterInput]", value: [{ column: "CustomerVerification.disabled", value: false }] } },
  //     fields: ["id", "disabled", "weight", "position", "name", "description"],
  //   });
  // props.customerAssignment.customer.registerCustomerVerificationReports(response.viewAllActiveCustomerVerification);
})

// const displayVerificationReportSubmissionDialog = ref<boolean>(false)
// const throttleReportRequest = ref<boolean>(false)
// const toSubmitVerifiationReport = ref<VerificationReport>()
// const showVerificationReportSubmission = (verificationReport: VerificationReport) => {
//   toSubmitVerifiationReport.value = verificationReport;
//   displayVerificationReportSubmissionDialog.value = true
// }

const limitString = (string: string | undefined, length: number) => {
  return useStringLimiter(string, length)
}
</script>

<style scoped></style>