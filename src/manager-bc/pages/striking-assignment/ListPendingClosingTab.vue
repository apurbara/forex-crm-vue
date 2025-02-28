<template>
  <ListOffsetTableSection :hidden-filters="hiddenFilters" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { CustomerAssignmentStatus } from '@/shared-bc/domain/enum/customer-assignment-status';
import ListOffsetTableSection from './ListOffsetTableSection.vue';
import FilterType from '@/resources/components/pagination/filter';

const hiddenFilters = ref<FilterType[]>(
  [
    { column: 'StrikingAssignment.Status', value: CustomerAssignmentStatus.ACTIVE },
    { column: 'hasPendingClosingRequest', value: true },
  ]
);

</script>

<style lang="scss" scoped></style>