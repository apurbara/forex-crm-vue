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
      <CommonSalesMetricComponent :common-sales-metric="commonSalesMetric" :readonly="!editing" />
      <div class="d-flex justify-end" v-if="editing">
        <v-btn :disabled="!commonSalesMetric.isValidProperties()" @click="update">Update</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CommonSalesMetricComponent from '@/company-bc/domain/model/CommonSalesMetricComponent.vue';
import CommonSalesMetric, { CommonSalesMetricType } from '@/company-bc/domain/model/common-sales-metric';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, reactive, ref } from 'vue';

const { httpRequest, companyUserRepository, cache } = useDependencyInjection();

const commonSalesMetric = reactive(new CommonSalesMetric())
const props = defineProps<{ commonSalesMetricId: string }>()
let editing = ref(false)
let cacheData: CommonSalesMetricType;

onMounted(async () => {
  cacheData = cache?.pull<CommonSalesMetricType>(`common-sales-metric-${props.commonSalesMetricId}`);
  if (cacheData) {
    commonSalesMetric.load(cacheData);
  } else {
    const response = await companyUserRepository.getUser()
      .executeGraphqlQueryInCompany<{ viewCommonSalesMetricDetail: CommonSalesMetricType }>(httpRequest, {
        operation: 'viewCommonSalesMetricDetail',
        variables: { id: { type: 'ID!', value: props.commonSalesMetricId } },
        fields: [
          'id', 'lastModifiedTime', 'name', 'metricType', 'evaluationType', 'recurrenceType', 'recurrenceCount',
          'target'
        ],
      })
    cacheData = response.viewCommonSalesMetricDetail
    commonSalesMetric.load(cacheData)
  }
})

const update = async () => {
  const response = await companyUserRepository.getUser()
    .executeGraphqlMutationInCompany<{ updateCommonSalesMetric: CommonSalesMetricType }>(httpRequest, {
      operation: "updateCommonSalesMetric",
      variables: commonSalesMetric.toGraphqlVariables(),
      fields: [
        'lastModifiedTime', 'name', 'metricType', 'evaluationType', 'recurrenceType', 'recurrenceCount',
        'target'
      ],
    })
  commonSalesMetric.load(response.updateCommonSalesMetric)
  cacheData = { ...cacheData, ...response.updateCommonSalesMetric }
  editing.value = false
}

const cancelEdit = () => {
  commonSalesMetric.load(cacheData)
  editing.value = false;
}

</script>

<style lang="scss" scoped></style>