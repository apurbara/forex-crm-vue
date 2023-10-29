<template>
  <div>
    <div>
      <div class="filter" style="justify-content: space-between;">
        <div style="width: 420px; display: flex">
          <div style="width: 320px">
            <v-text-field placeholder="Cari..." variant="outlined" hide-details
              v-model="pagination.keywordSearch" v-on:keyup.enter="renewList()">
              <template v-slot:append-inner>
                <div class="btn-append-primary" @click="renewList()" style="cursor: pointer">
                  <img src="@/assets/icons/ic-search.svg" style="position: relative; top: 12px; left: 12px" />
                </div>
              </template>
            </v-text-field>
          </div>
          <v-menu v-if="pagination.filters.length > 0">
            <template v-slot:activator="{ props }">
              <v-btn class="filter ml-2" min-height="40" v-bind="props">
                <img src="@/assets/icons/button/filter.svg" alt="no data" class="mr-2" />Filter
              </v-btn>
            </template>
            <div class="py-2" style="width: 240px; background-color: white; border-radius: 8px;">
              <div v-for="(filter, index) in pagination.filters" :key="index">
                <v-divider v-if="index > 0" />
                <EnumFilterComponent v-if="filter.type === 'ENUM'" class="mx-4 my-2" :enum-filter="filter"
                  @filter-updated="renewList" />
              </div>
            </div>
          </v-menu>
        </div>
        <div style="display: flex; justify-content: end;">
          <slot name="filter"></slot>
        </div>
      </div>
      <div v-if="pagination.getAppliedFilters()?.length > 0" class="d-flex mt-4">
        <div class="font-12 font-medium font-link mx-2 mt-1" style="cursor: pointer" @click="resetFilter()">Reset</div>
        <div v-for="(filter, index) in pagination.filters" :key="index">
          <v-chip v-for="appliedFilter in filter.getAppliedFilters()" :key="appliedFilter.value ?? appliedFilter"
            color="primary" closable close-icon="mdi-close"
            @click:close="removeAppliedFilter(filter, appliedFilter.value ?? appliedFilter)" class="ml-2 px-2">
            <span class="font-12 font-medium">{{ appliedFilter.title }}</span>
          </v-chip>
          <!-- <div class="chip-blue ml-2" v-for="(appliedFilter, index) in pagination.getAppliedFilters()" :key="index">
          {{ appliedFilter }}
        </div> -->
        </div>
      </div>
      <slot></slot>
      <OffsetLimitComponent :offset-limit="pagination.offsetLimit" @renew-list="renewList" @load-page="loadPage" />
    </div>
  </div>
</template>

<script setup lang="ts" generic="ResultType">
import Pagination from './pagination';
import OffsetLimitComponent from "./pagination/OffsetLimitComponent.vue";
import EnumFilterComponent from "./pagination/EnumFilterComponent.vue";
import EnumFilter from './pagination/enum-filter';


const props = defineProps<{ pagination: Pagination<ResultType> }>()

const renewList = async () => {
  await props.pagination.renewList();
}
const loadPage = async () => {
  await props.pagination.init();
}
const submitKeywordSearch = async () => {
  await props.pagination.renewList()
}
const resetFilter = async () => {
  await props.pagination.resetFilters();
}
const removeAppliedFilter = async (filter: EnumFilter, appliedFilterValue: string) => {
  await props.pagination.removeAppliedFilter(filter, appliedFilterValue);
}


// export default {
//   components: {
//     OffsetLimitComponent: OffsetLimitComponent,
//     EnumFilterComponent,
//   },
//   props: {
//     pagination: Pagination,
//     paginationType: {
//       type: String,
//       default() {
//         return "card";
//       },
//     },
//   },
//   data() {
//     return {
//       keyword: null,
//     };
//   },
//   methods: {

//   },
// };
</script>

<style scoped></style>
