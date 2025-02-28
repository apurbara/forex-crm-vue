<template>
  <LabelComponent :label="salesActivity.label" :readonly="readonly" />
  <v-text-field label="duration" v-model="salesActivity.duration" type="number"
    :rules="[salesActivity.isValidDuration()]" :readonly="readonly" />
</template>

<script lang="ts" setup>
import LabelComponent from '@/shared-bc/domain/value-object/LabelComponent.vue';
import SalesActivity from './sales-activity';

const props = defineProps<{ salesActivity: SalesActivity, readonly?: boolean }>()

</script>

<style lang="scss" scoped></style>