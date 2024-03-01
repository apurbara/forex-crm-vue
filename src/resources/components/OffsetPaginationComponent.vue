<template>
  <PaginationComponent :pagination="pagination">
    <template v-slot:editSection>
      <slot name="editSection"></slot>
    </template>
    
    <template v-slot:default>
      <section class="pagination__result-list d-flex justify-start ma-2">
        <slot></slot>
      </section>
    </template>
    
    <template v-slot:navigation>
      <div class="d-flex justify-space-between align-center">
        <div>
          <slot name="navigation"></slot>
        </div>
        <section class="pagination__page-navigation d-flex justify-end align-center">
          <div class="d-flex justify-right align-center">
            <span class="mr-4">Page Size</span>
            <v-combobox variant="plain" menu-icon="mdi-chevron-down" :items="pageSizeSelection"
              v-model="pagination.offsetLimit.pageSize" hide-details @update:modelValue="loadPage"></v-combobox>
          </div>
          <v-pagination :length="pagination.offsetLimit.getTotalPage()" :total-visible="4"
            v-model="pagination.offsetLimit.page" density="comfortable" variant="text"
            @update:modelValue="loadPage"></v-pagination>
        </section>
      </div>
    </template>
  </PaginationComponent>
</template>

<script setup lang="ts" generic="ResultType">
import { reactive } from 'vue';
import OffsetPagination from './offset-pagination';
import PaginationComponent from "./PaginationComponent.vue";

const props = defineProps<{ pagination: OffsetPagination<ResultType> }>()

const pageSizeSelection = reactive<number[]>([20, 50, 100])

const loadPage = async () => {
  await props.pagination.loadPage();
}
</script>

<style scoped></style>
