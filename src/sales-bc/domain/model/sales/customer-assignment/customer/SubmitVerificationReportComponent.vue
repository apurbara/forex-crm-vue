<template>
  <div class="mb-4">
    <p class="font-20 font-weight-bold">{{ verificationReport.customerVerification?.name }}</p>
    <p class="font-14">{{ verificationReport.customerVerification?.description }}</p>
  </div>
  <v-textarea label="note" v-model="verificationReport.note"></v-textarea>
</template>

<script lang="ts" setup>
import VerificationReport from './verification-report';

defineProps<{ verificationReport: VerificationReport }>()

</script>

<style lang="scss" scoped></style>