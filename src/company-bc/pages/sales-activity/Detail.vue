<template>
  <div class="page-section">
    <h1 class="page-title">Sales Activity Detail</h1>
    <div class="d-flex justify-end"></div>
    <div class="form">
      <div class="d-flex justify-end">
        <v-btn variant="tonal" v-if="!editing" @click="editing = !editing">Edit</v-btn>
        <v-btn variant="tonal" v-else @click="cancelEdit">Cancel</v-btn>
      </div>
      <SalesActivityComponent :sales-activity="salesActivity" :readonly="!editing" />
      <div class="d-flex justify-end" v-if="editing">
        <v-btn :disabled="!salesActivity.isValidProperties()" @click="update">Update</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SalesActivityComponent from "@/company-bc/domain/model/SalesActivityComponent.vue";
import SalesActivity, { SalesActivityType } from "@/company-bc/domain/model/sales-activity";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { onMounted, reactive, ref } from "vue";

const { companyUserRepository, cache } = useDependencyInjection();

const salesActivity = reactive(new SalesActivity());
const props = defineProps<{ salesActivityId: string }>();
let editing = ref(false);
let cacheData: SalesActivityType;

onMounted(async () => {
  cacheData = cache?.pull<SalesActivityType>(`sales-activity-${props.salesActivityId}`);
  if (cacheData) {
    salesActivity.load(cacheData);
  } else {
    const response = await companyUserRepository
      .getUser()!
      .executeGraphqlQueryInCompany<{ salesActivityDetail: SalesActivityType }>({
        operation: "salesActivityDetail",
        variables: { id: { type: "ID!", value: props.salesActivityId } },
        fields: ["id", "disabled", "createdTime", "initial", "name", "description", "duration"],
      });
    cacheData = response.salesActivityDetail;
    salesActivity.load(cacheData);
  }
});

const update = async () => {
  const response = await companyUserRepository
    .getUser()!
    .executeGraphqlMutationInCompany<{ updateSalesActivity: SalesActivityType }>({
      operation: "updateSalesActivity",
      variables: salesActivity.toGraphqlVariables(),
      fields: ["name", "description", "duration"],
    });
  salesActivity.load(response.updateSalesActivity);
  cacheData = { ...cacheData, ...response.updateSalesActivity };
  editing.value = false;
};

const cancelEdit = () => {
  salesActivity.load(cacheData);
  editing.value = false;
};
</script>

<style lang="scss" scoped></style>
