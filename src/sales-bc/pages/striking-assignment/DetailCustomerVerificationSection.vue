<template>
  <div class="d-flex justify-space-between">
    <h2 class="section-title">Customer Verification</h2>
    <v-chip>{{ strikingAssignment.customerAssignment.customer?.countTotalVerificationWeight() }}</v-chip>
  </div>
  <div v-if="strikingAssignment.customerAssignment.customer.getVerifiedReportList().length > 0" class="ma-4">
    <ul>
      <li v-for="(verificationReport, index) in strikingAssignment.customerAssignment.customer.getVerifiedReportList()"
        :key="verificationReport.id ?? index">
        {{ verificationReport.customerVerification?.name }} {{ verificationReport.note ? `:
        ${verificationReport.note}` : `` }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { CustomerVerificationType } from '@/company-bc/domain/model/customer-verification';
import { useStringLimiter } from '@/resources/composables/typography';
import StrikingAssignment from '@/sales-bc/domain/model/sales/striking-assignment';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, ref } from 'vue';

const props = defineProps<{ strikingAssignment: StrikingAssignment }>();
const { companyUserRepository, salesRepository } = useDependencyInjection();

onMounted(async () => {
  const response = await companyUserRepository.getUser()!
    .executeGraphqlQueryInCompany<{ viewAllActiveCustomerVerification: CustomerVerificationType[] }>({
      operation: "viewAllActiveCustomerVerification",
      variables: { filters: { type: "[FilterInput]", value: [{ column: "CustomerVerification.disabled", value: false }] } },
      fields: ["id", "disabled", "weight", "position", "name", "description"],
    });
  props.strikingAssignment.customerAssignment.customer.registerCustomerVerificationReports(response.viewAllActiveCustomerVerification);
})

const limitString = (string: string | undefined, length: number) => {
  return useStringLimiter(string, length)
}
</script>

<style scoped></style>