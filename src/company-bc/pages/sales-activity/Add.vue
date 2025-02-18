<template>
  <div class="page-section">
    <h1 class="page-title">Add Sales Activity</h1>
    <div class="form">
      <SalesActivityComponent :sales-activity="salesActivity" />
      <div class="d-flex justify-end">
        <v-btn :disabled="!salesActivity.isValidProperties()" @click="submit">Submit</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SalesActivityComponent from "@/company-bc/domain/model/SalesActivityComponent.vue";
import SalesActivity, { SalesActivityType } from "@/company-bc/domain/model/sales-activity";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { reactive } from "vue";
import { useRouter } from "vue-router";

const salesActivity = reactive(new SalesActivity());

const { companyUserRepository, cache } = useDependencyInjection();
const router = useRouter();

const submit = async () => {
  const response = await companyUserRepository
    .getUser()!
    .executeGraphqlMutationInCompany<{ addSalesActivity: SalesActivityType }>({
      operation: "addSalesActivity",
      variables: salesActivity.toGraphqlVariables(),
      fields: ["id", "disabled", "createdTime", "initial", "name", "description", "duration"],
    });
  cache?.set(`sales-activity-${response?.addSalesActivity.id}`, response?.addSalesActivity);
  router.push(`/company/sales-activity/${response?.addSalesActivity.id}`);
};
</script>

<style lang="scss" scoped></style>
