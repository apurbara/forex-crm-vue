<template>
  <LabelComponent :label="areaStructure.label" :readonly="readonly"></LabelComponent>
</template>

<script lang="ts" setup>
import LabelComponent from '@/shared-bc/domain/value-object/LabelComponent.vue';
import AreaStructure from './area-structure';

const props = defineProps<{ areaStructure: AreaStructure, readonly?: boolean }>()

</script>

<style lang="scss" scoped></style>