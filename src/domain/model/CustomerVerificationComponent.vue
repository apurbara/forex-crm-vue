<template>
  <LabelComponent :label="customerVerification.label"></LabelComponent>
  <v-text-field label="weight" v-model="customerVerification.weight" type="number"></v-text-field>
  <v-text-field label="position" v-model="customerVerification.position" type="number"></v-text-field>
</template>

<script lang="ts" setup>
import LabelComponent from '../value-object/LabelComponent.vue';
import CustomerVerification from './customer-verification';

const props = defineProps<{ customerVerification: CustomerVerification }>()

</script>

<style lang="scss" scoped></style>