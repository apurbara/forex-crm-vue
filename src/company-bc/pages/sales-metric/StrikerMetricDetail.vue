<template>
  <div>
    <h1 class="page-title">Striker Metric Detail</h1>
    <div class="d-flex justify-end">
    </div>
    <div class="form">
      <div class="d-flex justify-end">
        <v-btn variant="tonal" v-if="!editing" @click="editing = !editing">Edit</v-btn>
        <v-btn variant="tonal" v-else @click="cancelEdit">Cancel</v-btn>
      </div>
      <StrikerMetricComponent :striker-metric="strikerMetric" :readonly="!editing" />
      <div class="d-flex justify-end" v-if="editing">
        <v-btn :disabled="!strikerMetric.isValidStrikerMetric()" @click="update">Update</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import StrikerMetric, { StrikerMetricType } from '@/company-bc/domain/model/striker-metric';
import StrikerMetricComponent from '@/company-bc/domain/model/StrikerMetricComponent.vue';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, reactive, ref } from 'vue';

const { companyUserRepository, cache } = useDependencyInjection();

const strikerMetric = reactive(new StrikerMetric())
const props = defineProps<{ strikerMetricId: string }>()
let editing = ref(false)
let cacheData: StrikerMetricType;

onMounted(async () => {
  cacheData = cache?.pull<StrikerMetricType>(`striker-metric-${props.strikerMetricId}`);
  if (cacheData) {
    strikerMetric.load(cacheData);
  } else {
    const response = await companyUserRepository.getUser()!
      .executeGraphqlQueryInCompany<{ viewStrikerMetricDetail: StrikerMetricType }>({
        operation: 'viewStrikerMetricDetail',
        variables: { id: { type: 'ID!', value: props.strikerMetricId } },
        fields: [
          'id', 'createdTime', 'name', 'salesMetricType', 'dailyReminderTarget', 'evaluationType', 'recurrenceType', 'recurrenceCount', 'target'
        ],
      })
    cacheData = response.viewStrikerMetricDetail
    strikerMetric.load(cacheData)
  }
})

const update = async () => {
  const response = await companyUserRepository.getUser()!
    .executeGraphqlMutationInCompany<{ updateStrikerMetric: StrikerMetricType }>({
      operation: "updateStrikerMetric",
      variables: strikerMetric.toGraphqlVariables(),
      fields: [
        'name', 'salesMetricType', 'dailyReminderTarget', 'evaluationType', 'recurrenceType', 'recurrenceCount', 'target'
      ],
    })
  strikerMetric.load(response.updateStrikerMetric)
  cacheData = { ...cacheData, ...response.updateStrikerMetric }
  editing.value = false
}

const cancelEdit = () => {
  strikerMetric.load(cacheData)
  editing.value = false;
}

</script>

<style lang="scss" scoped></style>