<template>
  <div class="page-section">
    <h1 class="page-title">Add Manager</h1>
    <div class="form">
      <ManagerCreateComponent :manager="manager" />
      <div class="d-flex justify-end">
        <v-btn :disabled="!manager.isValidToCreate()" @click="submit">Submit</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ManagerCreateComponent from "@/company-bc/domain/model/ManagerCreateComponent.vue";
import Manager, { ManagerType } from "@/company-bc/domain/model/manager";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { reactive } from "vue";
import { useRouter } from "vue-router";

const manager = reactive(new Manager());

const { companyUserRepository, cache } = useDependencyInjection();
const router = useRouter();

const submit = async () => {
  const response = await companyUserRepository
    .getUser()!
    .executeGraphqlMutationInCompany<{ addManager: ManagerType }>({
      operation: "addManager",
      variables: manager.toGraphqlVariables(),
      fields: ["id", "suspended", "createdTime", "name", "email"],
    });
  cache?.set(`manager-${response?.addManager.id}`, response?.addManager);
  router.push(`/company/manager/${response?.addManager.id}`);
};
</script>

<style lang="scss" scoped></style>
