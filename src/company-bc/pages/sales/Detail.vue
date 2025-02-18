<template>
  <div class="page-section">
    <h1 class="page-title">Sales Detail</h1>
    <div class="d-flex justify-end"></div>
    <div class="form">
      <SalesComponent :sales="sales" :readonly="true" />
      <v-autocomplete
        label="manager"
        variant="outlined"
        :items="managerList"
        density="compact"
        item-title="name"
        return-object
        v-model="sales.manager"
        :readonly="true"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import SalesComponent from "@/company-bc/domain/model/SalesComponent.vue";
import { ManagerType } from "@/company-bc/domain/model/manager";
import Sales, { SalesType } from "@/company-bc/domain/model/sales";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { onMounted, reactive, ref } from "vue";

const { companyUserRepository, cache } = useDependencyInjection();

const sales = reactive(new Sales());
const props = defineProps<{ salesId: string }>();
const managerList = ref<ManagerType[]>([]);
let cacheData: SalesType;

onMounted(async () => {
  cacheData = cache?.pull<SalesType>(`sales-${props.salesId}`);
  if (cacheData) {
    sales.load(cacheData);
  } else {
    const response = await companyUserRepository
      .getUser()!
      .executeGraphqlQueryInCompany<{ viewSalesDetail: SalesType }>({
        operation: "viewSalesDetail",
        variables: { id: { type: "ID!", value: props.salesId } },
        fields: [
          "id",
          "contractTerminated",
          "createdTime",
          "contractTerminatedTime",
          "name",
          "email",
          "type",
          { manager: ["id", "name"] },
        ],
      });
    cacheData = response.viewSalesDetail;
    sales.load(cacheData);
  }

  const managerListReponse = await companyUserRepository
    .getUser()!
    .executeGraphqlQueryInCompany<{ viewAllManager: ManagerType[] }>({
      operation: "viewAllManager",
      variables: {
        filters: { type: "[FilterInput]", value: [{ column: "Manager.suspended", value: false }] },
      },
      fields: ["id", "name"],
    });
  managerList.value = managerListReponse.viewAllManager;
});
</script>

<style lang="scss" scoped></style>
