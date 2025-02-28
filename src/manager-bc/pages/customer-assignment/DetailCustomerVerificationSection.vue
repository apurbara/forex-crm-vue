<template>
  <!-- <section class="page-section ma-2"> -->
  <div class="d-flex justify-space-between">
    <h2 class="section-title">Customer Verification</h2>
    <v-chip>{{ countTotalVerificationWeight() }}</v-chip>
  </div>
  <div v-if="customer.verificationReports?.length ?? 0 > 0" class="ma-4">
    <ul>
      <li v-for="(verificationReport, index) in customer.verificationReports" :key="verificationReport.id ?? index">
        {{ verificationReport.customerVerification?.name }} {{ verificationReport.note ? `:
        ${verificationReport.note}` : `` }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { CustomerType } from '@/company-bc/domain/model/customer';
import { useStringLimiter } from '@/resources/composables/typography';

const props = defineProps<{ customer: CustomerType }>();

const limitString = (string: string | undefined, length: number) => {
  return useStringLimiter(string, length)
}

const countTotalVerificationWeight = () => {
  return props.customer.verificationReports?.reduce((acc, verificationReport) => {
    return acc + verificationReport.customerVerification?.weight!;
  }, 0)
}
</script>

<style scoped></style>