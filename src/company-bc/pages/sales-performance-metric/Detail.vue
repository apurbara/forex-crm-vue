<template>
  <div>
    <h1 class="page-title">Common Metric Sales Detail</h1>
    <div class="d-flex justify-end">
    </div>
    <div class="form">
      <div class="d-flex justify-end">
        <v-btn variant="tonal" v-if="!editing" @click="editing = !editing">Edit</v-btn>
        <v-btn variant="tonal" v-else @click="cancelEdit">Cancel</v-btn>
      </div>
      <SalesPerformanceMetricComponent :sales-performance-metric="salesPerformanceMetric" :readonly="!editing" />
      <div class="d-flex justify-end" v-if="editing">
        <v-btn :disabled="!salesPerformanceMetric.isValidProperties()" @click="update">Update</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SalesPerformanceMetricComponent from '@/company-bc/domain/model/SalesPerformanceMetricComponent.vue';
import SalesPerformanceMetric, { SalesPerformanceMetricType } from '@/company-bc/domain/model/sales-performance-metric';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const { companyUserRepository, cache } = useDependencyInjection();

const salesPerformanceMetric = reactive(new SalesPerformanceMetric())
const props = defineProps<{ salesPerformanceMetricId: string }>()
let editing = ref(false)
let cacheData: SalesPerformanceMetricType;

onMounted(async () => {
  cacheData = cache?.pull<SalesPerformanceMetricType>(`sales-performance-metric-${props.salesPerformanceMetricId}`);
  if (cacheData) {
    salesPerformanceMetric.load(cacheData);
  } else {
    const response = await companyUserRepository.getUser()!
      .executeGraphqlQueryInCompany<{ viewSalesPerformanceMetricDetail: SalesPerformanceMetricType }>({
        operation: 'viewSalesPerformanceMetricDetail',
        variables: { id: { type: 'ID!', value: props.salesPerformanceMetricId } },
        fields: [
          'id', 'disabled', 'lastModifiedTime', 'name', 'salesPerformanceMetricType', 'recurrenceType', 'recurrenceCount',
          { evaluations: ['alias', 'evaluationType'] }
        ],
      })
    cacheData = response.viewSalesPerformanceMetricDetail
    salesPerformanceMetric.load(cacheData)
  }
})

const update = async () => {
  const response = await companyUserRepository.getUser()!
    .executeGraphqlMutationInCompany<{ updateSalesPerformanceMetric: SalesPerformanceMetricType }>({
      operation: "updateSalesPerformanceMetric",
      variables: salesPerformanceMetric.toGraphqlVariables(),
      fields: [
        'lastModifiedTime', 'name', 'salesPerformanceMetricType', 'recurrenceType', 'recurrenceCount',
        { evaluations: ['alias', 'evaluationType'] }
      ],
    })
  salesPerformanceMetric.load(response.updateSalesPerformanceMetric)
  cacheData = { ...cacheData, ...response.updateSalesPerformanceMetric }
  editing.value = false
}

const cancelEdit = () => {
  salesPerformanceMetric.load(cacheData)
  editing.value = false;
}

</script>

<style lang="scss" scoped></style>