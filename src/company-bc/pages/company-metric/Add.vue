<template>
  <div>
    <h1 class="page-title">Add Company Metric</h1>
    <div class="form">
      <CompanyMetricComponent :company-metric="companyMetric" />
      <div class="d-flex justify-end">
        <v-btn :disabled="!companyMetric.isValidProperties()" @click="submit">Submit</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CompanyMetricComponent from '@/company-bc/domain/model/CompanyMetricComponent.vue';
import CompanyMetric, { CompanyMetricType } from '@/company-bc/domain/model/company-metric';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const companyMetric = reactive(new CompanyMetric());

const { companyUserRepository, cache } = useDependencyInjection()
const router = useRouter()


const submit = async () => {
  const response = await companyUserRepository.getUser()!
    .executeGraphqlMutationInCompany<{ createCompanyMetric: CompanyMetricType }>({
      operation: 'createCompanyMetric',
      variables: companyMetric.toGraphqlVariables(),
      fields: [
        'id', 'disabled', 'lastModifiedTime', 'name', 'metricType', 'evaluationType', 'recurrenceType',
        'recurrenceCount', 'target'
      ]
    })
  cache?.set(`company-metric-${response?.createCompanyMetric.id}`, response?.createCompanyMetric)
  router.push(`/company-metric/${response?.createCompanyMetric.id}`)
}

</script>

<style lang="scss" scoped></style>