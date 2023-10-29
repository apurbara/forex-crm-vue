<template>
  <PaginationComponent :pagination="pagination">
    <template v-slot:filterExtension>
      <v-select v-if="pagination.cursorLimit.availableOrders.length > 0" prepend-inner-icon="mdi-swap-vertical"
        :items="pagination.cursorLimit.availableOrders" return-object hide-details variant="plain" placeholder="SORT"
        menu-icon="mdi-chevron-down" v-model="pagination.cursorLimit.appliedOrder"
        @update:model-value="applyOrder"></v-select>
    </template>
    <template v-slot:editSection>
      <slot name="editSection"></slot>
    </template>

    <template v-slot:default>
      <section class="pagination__result-list">
        <slot></slot>
      </section>
    </template>

    <template v-slot:navigation>
      <section class="pagination__page-navigation d-flex justify-space-between align-center">
        <div v-if="pagination.resultList.length > 0"> showing 1 - {{ pagination.resultList.length }} of {{
          pagination.cursorLimit.total }}</div>
        <v-btn v-if="pagination.cursorLimit.cursorToNextPage" @click="loadNextPage">Load More</v-btn>
      </section>
    </template>
  </PaginationComponent>
</template>

<script setup lang="ts" generic="ResultType">
import CursorPagination from './cursor-pagination';
import PaginationComponent from "./PaginationComponent.vue";


const props = defineProps<{ pagination: CursorPagination<ResultType> }>()

const loadNextPage = async () => {
  await props.pagination.loadNextPage();
}
const applyOrder = async () => {
  await props.pagination.resetList();
}
</script>

<style scoped></style>
