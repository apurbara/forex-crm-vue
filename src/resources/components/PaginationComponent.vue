<template>
  <div class="pagination">
    <section class="pagination__filter">
      <div class="d-flex flex-wrap justify-space-between align-center">
        <div class="d-flex flex-wrap justify-start align-center gap-4">
          <v-text-field
            v-if="pagination.keywordSearch"
            class="flex-grow-1 flex-shrink-1"
            style="min-width: 300px; max-width: 100%"
            hide-details
            variant="plain"
            :placeholder="pagination.keywordSearch.placeholder"
            v-model="pagination.keywordSearch.value"
            append-inner-icon="mdi-magnify"
            @keyup.enter="submitKeywordSearch"
            clearable
            @click:append-inner="submitKeywordSearch"
            density="compact"
          ></v-text-field>
          <div class="filter">
            <v-menu v-if="pagination.availableFilters.length > 0" :close-on-content-click="false">
              <template v-slot:activator="{ props }">
                <v-btn append-icon="mdi-filter-outline" v-bind="props" variant="plain"
                  >Filter</v-btn
                >
              </template>
              <div class="filter-list elevation-1">
                <div v-for="(filter, index) in pagination.availableFilters" :key="index">
                  <v-divider v-if="index > 0" />
                  <EnumFilterComponent
                    class="mx-4 my-2"
                    :enum-filter="filter"
                    @filter-updated="renewList"
                  />
                </div>
              </div>
            </v-menu>
          </div>
          <div>
            <slot name="filterExtension"></slot>
          </div>
        </div>
        <div>
          <slot name="editSection"></slot>
        </div>
      </div>
      <div v-if="hasSelectedFilters" class="d-flex flex-wrap justify-start align-center">
        <div class="ma-2">
          <v-btn @click="resetFilter">Reset</v-btn>
        </div>
        <div v-for="filter in pagination.availableFilters" :key="filter.selectedItems.length">
          <v-chip
            v-for="(selectedItem, index) in filter.selectedItems"
            :key="index"
            color="primary"
            closable
            close-icon="mdi-close"
            @click:close="removeFilterSelectedItem(filter, selectedItem)"
            class="ma-1"
          >
            <span>{{ selectedItem.label }}</span>
          </v-chip>
        </div>
      </div>
    </section>
    <slot></slot>
    <div class="ma-2">
      <slot name="navigation"></slot>
    </div>
  </div>
</template>

<script setup lang="ts" generic="ResultType">
import EnumFilterComponent from "./pagination/EnumFilterComponent.vue";
import EnumFilter, { EnumFilterItemType } from "./pagination/enum-filter";
import AbstractPagination from "./abstract-pagination";
import { computed } from "vue";

const props = defineProps<{ pagination: AbstractPagination<ResultType> }>();

const hasSelectedFilters = computed(() => {
  return props.pagination.hasSelectedFilter();
});

const renewList = async () => {
  await props.pagination.resetList();
};
const submitKeywordSearch = async () => {
  await props.pagination.resetList();
};
const resetFilter = async () => {
  await props.pagination.resetFilter();
};
const removeFilterSelectedItem = async (filter: EnumFilter, selectedItem: EnumFilterItemType) => {
  await props.pagination.removeFilterSelectedItem(filter, selectedItem);
};
</script>

<style scoped></style>
