<template>
  <LabelComponent :label="customerVerification.label"></LabelComponent>
</template>

<script lang="ts" setup>
import LabelComponent from '../value-object/LabelComponent.vue';
import CustomerVerification from './customer-verification';

const props = defineProps<{ customerVerification: CustomerVerification }>()

</script>

<style lang="scss" scoped></style>