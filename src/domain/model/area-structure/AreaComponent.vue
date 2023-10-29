<template>
  <LabelComponent :label="area.label"></LabelComponent>
</template>

<script lang="ts" setup>
import LabelComponent from '@/domain/value-object/LabelComponent.vue';
import Area from './area';

const props = defineProps<{ area: Area }>()

</script>

<style lang="scss" scoped></style>