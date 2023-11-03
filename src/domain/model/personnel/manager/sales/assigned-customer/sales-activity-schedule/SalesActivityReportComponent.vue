<template>
  <v-textarea ref="focus" label="report content" v-model="salesActivityReport.content"
    :rules="[salesActivityReport.isValidContent()]" />
</template>

<script lang="ts" setup>
import useFocus from '@/resources/composables/focus';
import SalesActivityReport from './sales-activity-report';

const { focus } = useFocus()

const props = defineProps<{ salesActivityReport: SalesActivityReport }>()
</script>

<style lang="scss" scoped></style>