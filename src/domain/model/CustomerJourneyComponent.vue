<template>
  <LabelComponent :label="customerJourney.label"></LabelComponent>
</template>

<script lang="ts" setup>
import LabelComponent from '../value-object/LabelComponent.vue';
import CustomerJourney from './customer-journey';

const props = defineProps<{ customerJourney: CustomerJourney }>()

</script>

<style lang="scss" scoped></style>