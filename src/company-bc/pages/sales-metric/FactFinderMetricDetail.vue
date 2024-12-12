<template>
  <div>
    <h1 class="page-title">Fact Finder Metric Detail</h1>
    <div class="d-flex justify-end">
    </div>
    <div class="form">
      <div class="d-flex justify-end">
        <v-btn variant="tonal" v-if="!editing" @click="editing = !editing">Edit</v-btn>
        <v-btn variant="tonal" v-else @click="cancelEdit">Cancel</v-btn>
      </div>
      <FactFinderMetricComponent :fact-finder-metric="factFinderMetric" :readonly="!editing" />
      <div class="d-flex justify-end" v-if="editing">
        <v-btn :disabled="!factFinderMetric.isValidFactFinderMetric()" @click="update">Update</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import FactFinderMetric, { FactFinderMetricType } from '@/company-bc/domain/model/fact-finder-metric';
import FactFinderMetricComponent from '@/company-bc/domain/model/FactFinderMetricComponent.vue';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, reactive, ref } from 'vue';

const { companyUserRepository, cache } = useDependencyInjection();

const factFinderMetric = reactive(new FactFinderMetric())
const props = defineProps<{ factFinderMetricId: string }>()
let editing = ref(false)
let cacheData: FactFinderMetricType;

onMounted(async () => {
  cacheData = cache?.pull<FactFinderMetricType>(`fact-finder-metric-${props.factFinderMetricId}`);
  if (cacheData) {
    factFinderMetric.load(cacheData);
  } else {
    const response = await companyUserRepository.getUser()!
      .executeGraphqlQueryInCompany<{ viewFactFinderMetricDetail: FactFinderMetricType }>({
        operation: 'viewFactFinderMetricDetail',
        variables: { id: { type: 'ID!', value: props.factFinderMetricId } },
        fields: [
          'id', 'createdTime', 'name', 'salesMetricType', 'dailyReminderTarget', 'evaluationType', 'recurrenceType', 'recurrenceCount', 'target'
        ],
      })
    cacheData = response.viewFactFinderMetricDetail
    factFinderMetric.load(cacheData)
  }
})

const update = async () => {
  const response = await companyUserRepository.getUser()!
    .executeGraphqlMutationInCompany<{ updateFactFinderMetric: FactFinderMetricType }>({
      operation: "updateFactFinderMetric",
      variables: factFinderMetric.toGraphqlVariables(),
      fields: [
        'name', 'salesMetricType', 'dailyReminderTarget', 'evaluationType', 'recurrenceType', 'recurrenceCount', 'target'
      ],
    })
  factFinderMetric.load(response.updateFactFinderMetric)
  cacheData = { ...cacheData, ...response.updateFactFinderMetric }
  editing.value = false
}

const cancelEdit = () => {
  factFinderMetric.load(cacheData)
  editing.value = false;
}

</script>

<style lang="scss" scoped></style>