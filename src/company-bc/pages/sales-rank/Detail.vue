<template>
  <div class="page-section">
    <h1 class="page-title">Sales Rank Config Detail</h1>
    <div class="d-flex justify-end"></div>
    <div class="form">
      <div class="d-flex justify-end">
        <v-btn variant="tonal" v-if="!editing" @click="editing = !editing">Edit</v-btn>
        <v-btn variant="tonal" v-else @click="cancelEdit">Cancel</v-btn>
      </div>
      <SalesRankComponent :sales-rank="salesRank" :readonly="!editing" />
      <div class="d-flex justify-end" v-if="editing">
        <v-btn :disabled="!salesRank.isValidProperties()" @click="update">Update</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SalesRankComponent from "@/company-bc/domain/model/SalesRankComponent.vue";
import SalesRank, { SalesRankType } from "@/company-bc/domain/model/sales-rank";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { onMounted, reactive, ref } from "vue";

const { companyUserRepository, cache } = useDependencyInjection();

const salesRank = reactive(new SalesRank());
const props = defineProps<{ salesRankId: string }>();
let editing = ref(false);
let cacheData: SalesRankType;

onMounted(async () => {
  cacheData = cache?.pull<SalesRankType>(`sales-rank-${props.salesRankId}`);
  if (cacheData) {
    salesRank.load(cacheData);
  } else {
    const response = await companyUserRepository
      .getUser()!
      .executeGraphqlQueryInCompany<{ viewSalesRankDetail: SalesRankType }>({
        operation: "viewSalesRankDetail",
        variables: { id: { type: "ID!", value: props.salesRankId } },
        fields: [
          ...["id", "lastModifiedTime", "name", "metricType"],
          ...["evaluationType", "recurrenceType", "queryOrder", "displaySalesNumber"],
        ],
      });
    cacheData = response.viewSalesRankDetail;
    salesRank.load(cacheData);
  }
});

const update = async () => {
  const response = await companyUserRepository
    .getUser()!
    .executeGraphqlMutationInCompany<{ updateSalesRank: SalesRankType }>({
      operation: "updateSalesRank",
      variables: salesRank.toGraphqlVariables(),
      fields: [
        ...["lastModifiedTime", "name", "metricType", "evaluationType"],
        ...["recurrenceType", "queryOrder", "displaySalesNumber"],
      ],
    });
  salesRank.load(response.updateSalesRank);
  cacheData = { ...cacheData, ...response.updateSalesRank };
  editing.value = false;
};

const cancelEdit = () => {
  salesRank.load(cacheData);
  editing.value = false;
};
</script>

<style lang="scss" scoped></style>
