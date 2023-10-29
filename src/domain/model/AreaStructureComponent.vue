<template>
  <LabelComponent :label="areaStructure.label"></LabelComponent>
</template>

<script lang="ts" setup>
import LabelComponent from '../value-object/LabelComponent.vue';
import AreaStructure from './area-structure';

const props = defineProps<{ areaStructure: AreaStructure }>()

</script>

<style lang="scss" scoped></style>