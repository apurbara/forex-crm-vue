<template>
  <LabelComponent :label="customerJourney.label" :readonly="readonly"></LabelComponent>
</template>

<script lang="ts" setup>
import LabelComponent from '@/shared-bc/domain/value-object/LabelComponent.vue';
import CustomerJourney from './customer-journey';

const props = defineProps<{ customerJourney: CustomerJourney, readonly?: boolean }>()

</script>

<style lang="scss" scoped></style>