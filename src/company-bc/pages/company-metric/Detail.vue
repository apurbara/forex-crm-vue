<template>
  <div class="page-section">
    <h1 class="page-title">Team Target Detail</h1>
    <div class="d-flex justify-end"></div>
    <div class="form">
      <div class="d-flex justify-end">
        <v-btn variant="tonal" v-if="!editing" @click="editing = !editing">Edit</v-btn>
        <v-btn variant="tonal" v-else @click="cancelEdit">Cancel</v-btn>
      </div>
      <CompanyMetricComponent :company-metric="companyMetric" :readonly="!editing" />
      <div class="d-flex justify-end" v-if="editing">
        <v-btn :disabled="!companyMetric.isValidProperties()" @click="update">Update</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CompanyMetricComponent from "@/company-bc/domain/model/CompanyMetricComponent.vue";
import CompanyMetric, { CompanyMetricType } from "@/company-bc/domain/model/company-metric";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { onMounted, reactive, ref } from "vue";

const { companyUserRepository, cache } = useDependencyInjection();

const companyMetric = reactive(new CompanyMetric());
const props = defineProps<{ companyMetricId: string }>();
let editing = ref(false);
let cacheData: CompanyMetricType;

onMounted(async () => {
  cacheData = cache?.pull<CompanyMetricType>(`company-metric-${props.companyMetricId}`);
  if (cacheData) {
    companyMetric.load(cacheData);
  } else {
    const response = await companyUserRepository
      .getUser()!
      .executeGraphqlQueryInCompany<{ viewCompanyMetricDetail: CompanyMetricType }>({
        operation: "viewCompanyMetricDetail",
        variables: { id: { type: "ID!", value: props.companyMetricId } },
        fields: [
          ...["id", "lastModifiedTime", "name", "metricType"],
          ...["evaluationType", "recurrenceType", "recurrenceCount", "target"],
        ],
      });
    cacheData = response.viewCompanyMetricDetail;
    companyMetric.load(cacheData);
  }
});

const update = async () => {
  const response = await companyUserRepository
    .getUser()!
    .executeGraphqlMutationInCompany<{ updateCompanyMetric: CompanyMetricType }>({
      operation: "updateCompanyMetric",
      variables: companyMetric.toGraphqlVariables(),
      fields: [
        "lastModifiedTime",
        "name",
        "metricType",
        "evaluationType",
        "recurrenceType",
        "recurrenceCount",
        "target",
      ],
    });
  companyMetric.load(response.updateCompanyMetric);
  cacheData = { ...cacheData, ...response.updateCompanyMetric };
  editing.value = false;
};

const cancelEdit = () => {
  companyMetric.load(cacheData);
  editing.value = false;
};
</script>

<style lang="scss" scoped></style>
