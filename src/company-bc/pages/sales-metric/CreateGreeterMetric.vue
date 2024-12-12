<template>
  <h1 class="page-title"> Create Greeter Metric </h1>
  <div class="form">
    <GreeterMetricComponent :greeter-metric="greeterMetric" />
    <div class="d-flex justify-end">
      <v-btn :disabled="!greeterMetric.isValidGreeterMetric()" @click="submit">submit</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import GreeterMetric, { GreeterMetricType } from '@/company-bc/domain/model/greeter-metric';
import GreeterMetricComponent from '@/company-bc/domain/model/GreeterMetricComponent.vue';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const { companyUserRepository, cache } = useDependencyInjection()
const router = useRouter()
const greeterMetric = reactive(new GreeterMetric());

const submit = async () => {
  const response = await companyUserRepository.getUser()!
    .executeGraphqlMutationInCompany<{ createGreeterMetric: GreeterMetricType }>({
      operation: 'createGreeterMetric',
      variables: greeterMetric.toGraphqlVariables(),
      fields: [
        'id', 'createdTime', 'disabled', 'name', 'salesMetricType', 'dailyReminderTarget', 'evaluationType', 'recurrenceType', 'recurrenceCount', 'target'
      ]
    })
  cache?.set(`greeter-metric-${response?.createGreeterMetric.id}`, response?.createGreeterMetric)
  router.push(`/sales-metric/greeter/${response?.createGreeterMetric.id}`)
}

</script>

<style scoped></style>