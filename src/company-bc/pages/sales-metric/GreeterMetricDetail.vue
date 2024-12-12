<template>
  <div>
    <h1 class="page-title">Greeter Metric Detail</h1>
    <div class="d-flex justify-end">
    </div>
    <div class="form">
      <div class="d-flex justify-end">
        <v-btn variant="tonal" v-if="!editing" @click="editing = !editing">Edit</v-btn>
        <v-btn variant="tonal" v-else @click="cancelEdit">Cancel</v-btn>
      </div>
      <GreeterMetricComponent :greeter-metric="greeterMetric" :readonly="!editing" />
      <div class="d-flex justify-end" v-if="editing">
        <v-btn :disabled="!greeterMetric.isValidGreeterMetric()" @click="update">Update</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import GreeterMetric, { GreeterMetricType } from '@/company-bc/domain/model/greeter-metric';
import GreeterMetricComponent from '@/company-bc/domain/model/GreeterMetricComponent.vue';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, reactive, ref } from 'vue';

const { companyUserRepository, cache } = useDependencyInjection();

const greeterMetric = reactive(new GreeterMetric())
const props = defineProps<{ greeterMetricId: string }>()
let editing = ref(false)
let cacheData: GreeterMetricType;

onMounted(async () => {
  cacheData = cache?.pull<GreeterMetricType>(`greeter-metric-${props.greeterMetricId}`);
  if (cacheData) {
    greeterMetric.load(cacheData);
  } else {
    const response = await companyUserRepository.getUser()!
      .executeGraphqlQueryInCompany<{ viewGreeterMetricDetail: GreeterMetricType }>({
        operation: 'viewGreeterMetricDetail',
        variables: { id: { type: 'ID!', value: props.greeterMetricId } },
        fields: [
          'id', 'createdTime', 'name', 'salesMetricType', 'dailyReminderTarget', 'evaluationType', 'recurrenceType', 'recurrenceCount', 'target'
        ],
      })
    cacheData = response.viewGreeterMetricDetail
    greeterMetric.load(cacheData)
  }
})

const update = async () => {
  const response = await companyUserRepository.getUser()!
    .executeGraphqlMutationInCompany<{ updateGreeterMetric: GreeterMetricType }>({
      operation: "updateGreeterMetric",
      variables: greeterMetric.toGraphqlVariables(),
      fields: [
        'name', 'salesMetricType', 'dailyReminderTarget', 'evaluationType', 'recurrenceType', 'recurrenceCount', 'target'
      ],
    })
  greeterMetric.load(response.updateGreeterMetric)
  cacheData = { ...cacheData, ...response.updateGreeterMetric }
  editing.value = false
}

const cancelEdit = () => {
  greeterMetric.load(cacheData)
  editing.value = false;
}

</script>

<style lang="scss" scoped></style>