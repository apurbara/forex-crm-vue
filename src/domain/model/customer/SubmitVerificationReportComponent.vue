<template>
  <div class="mb-4">
    <p class="font-20 font-weight-bold">{{ verificationReport.customerVerification.label.name }}</p>
    <p class="font-14">{{ verificationReport.customerVerification.label.description }}</p>
  </div>
  <v-textarea label="note" v-model="verificationReport.note"></v-textarea>
</template>

<script lang="ts" setup>
import VerificationReport from '@/domain/model/customer/verification-report';

const props = defineProps<{ verificationReport: VerificationReport }>()

</script>

<style lang="scss" scoped></style>