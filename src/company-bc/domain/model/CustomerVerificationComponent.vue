<template>
  <LabelComponent :label="customerVerification.label" :readonly="readonly"></LabelComponent>
  <v-text-field label="weight" v-model="customerVerification.weight" type="number" :readonly="readonly"></v-text-field>
  <v-text-field label="position" v-model="customerVerification.position" type="number"
    :readonly="readonly"></v-text-field>
</template>

<script lang="ts" setup>
import LabelComponent from '@/shared-bc/domain/value-object/LabelComponent.vue';
import CustomerVerification from './customer-verification';

const props = defineProps<{ customerVerification: CustomerVerification, readonly?: boolean }>()

</script>

<style lang="scss" scoped></style>