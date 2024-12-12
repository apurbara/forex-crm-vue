<template>
  <h1 class="page-title"> Create Striker Metric </h1>
  <div class="form">
    <StrikerMetricComponent :striker-metric="strikerMetric" />
    <div class="d-flex justify-end">
      <v-btn :disabled="!strikerMetric.isValidStrikerMetric()" @click="submit">submit</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import StrikerMetric, { StrikerMetricType } from '@/company-bc/domain/model/striker-metric';
import StrikerMetricComponent from '@/company-bc/domain/model/StrikerMetricComponent.vue';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const { companyUserRepository, cache } = useDependencyInjection()
const router = useRouter()
const strikerMetric = reactive(new StrikerMetric());

const submit = async () => {
  const response = await companyUserRepository.getUser()!
    .executeGraphqlMutationInCompany<{ createStrikerMetric: StrikerMetricType }>({
      operation: 'createStrikerMetric',
      variables: strikerMetric.toGraphqlVariables(),
      fields: [
        'id', 'createdTime', 'disabled', 'name', 'salesMetricType', 'dailyReminderTarget', 'evaluationType', 'recurrenceType', 'recurrenceCount', 'target'
      ]
    })
  cache?.set(`striker-metric-${response?.createStrikerMetric.id}`, response?.createStrikerMetric)
  router.push(`/sales-metric/striker/${response?.createStrikerMetric.id}`)
}

</script>

<style scoped></style>