<template>
  <h1 class="page-title"> Create Fact Finder Metric </h1>
  <div class="form">
    <FactFinderMetricComponent :fact-finder-metric="factFinderMetric" />
    <div class="d-flex justify-end">
      <v-btn :disabled="!factFinderMetric.isValidFactFinderMetric()" @click="submit">submit</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import FactFinderMetric, { FactFinderMetricType } from '@/company-bc/domain/model/fact-finder-metric';
import FactFinderMetricComponent from '@/company-bc/domain/model/FactFinderMetricComponent.vue';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const { companyUserRepository, cache } = useDependencyInjection()
const router = useRouter()
const factFinderMetric = reactive(new FactFinderMetric());

const submit = async () => {
  const response = await companyUserRepository.getUser()!
    .executeGraphqlMutationInCompany<{ createFactFinderMetric: FactFinderMetricType }>({
      operation: 'createFactFinderMetric',
      variables: factFinderMetric.toGraphqlVariables(),
      fields: [
        'id', 'createdTime', 'disabled', 'name', 'salesMetricType', 'dailyReminderTarget', 'evaluationType', 'recurrenceType', 'recurrenceCount', 'target'
      ]
    })
  cache?.set(`fact-finder-metric-${response?.createFactFinderMetric.id}`, response?.createFactFinderMetric)
  router.push(`/sales-metric/fact-finder/${response?.createFactFinderMetric.id}`)
}

</script>

<style scoped></style>