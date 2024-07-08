<template>
  <div>
    <h1 class="page-title">Add Common Sales Metric</h1>
    <div class="form">
      <CommonSalesMetricComponent :common-sales-metric="commonSalesMetric" />
      <div class="d-flex justify-end">
        <v-btn :disabled="!commonSalesMetric.isValidProperties()" @click="submit">Submit</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CommonSalesMetricComponent from '@/company-bc/domain/model/CommonSalesMetricComponent.vue';
import CommonSalesMetric, { CommonSalesMetricType } from '@/company-bc/domain/model/common-sales-metric';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const commonSalesMetric = reactive(new CommonSalesMetric());

const { httpRequest, companyUserRepository, cache } = useDependencyInjection()
const router = useRouter()


const submit = async () => {
  const response = await companyUserRepository.getUser()!
    .executeGraphqlMutationInCompany<{ createCommonSalesMetric: CommonSalesMetricType }>({
      operation: 'createCommonSalesMetric',
      variables: commonSalesMetric.toGraphqlVariables(),
      fields: [
        'id', 'disabled', 'lastModifiedTime', 'name', 'metricType', 'evaluationType', 'recurrenceType',
        'recurrenceCount', 'target'
      ]
    })
  cache?.set(`common-sales-metric-${response?.createCommonSalesMetric.id}`, response?.createCommonSalesMetric)
  router.push(`/common-sales-metric/${response?.createCommonSalesMetric.id}`)
}

</script>

<style lang="scss" scoped></style>