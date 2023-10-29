<template>
  <LabelComponent :label="salesActivity.label"></LabelComponent>
  <v-text-field label="duration" v-model="salesActivity.duration" type="number" :rules="[salesActivity.isValidDuration()]" />
</template>

<script lang="ts" setup>
import LabelComponent from '../value-object/LabelComponent.vue';
import SalesActivity from './sales-activity';

const props = defineProps<{ salesActivity: SalesActivity }>()

</script>

<style lang="scss" scoped></style>