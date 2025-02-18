<template>
  <div class="page-section">
    <h1 class="page-title">Manager Detail</h1>
    <div class="d-flex justify-end"></div>
    <div class="form">
      <ManagerComponent :manager="manager" :readonly="true" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import ManagerComponent from "@/company-bc/domain/model/ManagerComponent.vue";
import Manager, { ManagerType } from "@/company-bc/domain/model/manager";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { onMounted, reactive } from "vue";

const { companyUserRepository, cache } = useDependencyInjection();

const manager = reactive(new Manager());
const props = defineProps<{ managerId: string }>();
let cacheData: ManagerType;

onMounted(async () => {
  cacheData = cache?.pull<ManagerType>(`manager-${props.managerId}`);
  if (cacheData) {
    manager.load(cacheData);
  } else {
    const response = await companyUserRepository
      .getUser()!
      .executeGraphqlQueryInCompany<{ viewManagerDetail: ManagerType }>({
        operation: "viewManagerDetail",
        variables: { id: { type: "ID!", value: props.managerId } },
        fields: ["id", "suspended", "createdTime", "name", "email"],
      });
    cacheData = response.viewManagerDetail;
    manager.load(cacheData);
  }
});
</script>

<style lang="scss" scoped></style>
