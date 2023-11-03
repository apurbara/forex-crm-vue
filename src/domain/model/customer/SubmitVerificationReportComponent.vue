<template>
  <p>{{ verificationReport.customerVerification.label.name }}</p>
  <p>{{ verificationReport.customerVerification.label.description }}</p>
  <v-textarea label="note" v-model="verificationReport.note"></v-textarea>
</template>

<script lang="ts" setup>
import VerificationReport from '@/domain/model/customer/verification-report';

const props = defineProps<{ verificationReport: VerificationReport }>()

</script>

<style lang="scss" scoped></style>