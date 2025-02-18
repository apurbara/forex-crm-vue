<template>
  <div class="page-section">
    <h1 class="page-title">Sales Activity List</h1>
    <OffsetPaginationComponent :pagination="pagination">
      <template v-slot:editSection>
        <v-btn
          prepend-icon="mdi-account-plus-outline"
          variant="tonal"
          to="/company/sales-activity/set-initial"
          >Set Initial Sales Activity</v-btn
        >
        <v-btn
          class="ml-2"
          prepend-icon="mdi-account-plus-outline"
          variant="tonal"
          to="/company/sales-activity/add"
          >Add Sales Activity</v-btn
        >
      </template>
      <EmptyDataIllustrationComponent
        class="w-full"
        v-if="pagination.resultList.length < 1"
        message="Data Sales Activity Kosong"
      />
      <DataTable v-else :value="pagination.resultList" size="small" class="w-full">
        <Column field="name" header="Name"></Column>
        <Column field="initial" header="Initial"></Column>
        <Column field="duration" header="Duration"></Column>
        <Column field="description" header="Description"></Column>
        <Column>
          <template #body="{ data }">
            <DataTableActionComponent
              :value="data.disabled"
              :detail-path="`/company/sales-activity/${data.id}`"
              :enable-callback="enableCallback(data.id)"
              :enable-message="`do you really want to enable ${data.name}`"
              :disable-callback="disableCallback(data.id)"
              :disable-message="`do you really want to disable ${data.name}`"
            />
          </template>
        </Column>
      </DataTable>
    </OffsetPaginationComponent>
  </div>
</template>

<script lang="ts" setup>
import OffsetPaginationComponent from "@/resources/components/OffsetPaginationComponent.vue";
import { KeywordSearch, PaginationResponseType } from "@/resources/components/abstract-pagination";
import OffsetPagination from "@/resources/components/offset-pagination";
import EnumFilter from "@/resources/components/pagination/enum-filter";
import { onMounted, reactive } from "vue";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { SalesActivityType } from "@/company-bc/domain/model/sales-activity";
import EmptyDataIllustrationComponent from "@/shared/components/EmptyDataIllustrationComponent.vue";
import DataTableActionComponent from "@/shared/components/data-table-action-component.vue";

const { companyUserRepository } = useDependencyInjection();

const pagination = reactive(
  new OffsetPagination<SalesActivityType>(
    async (pagination) => {
      const response = await companyUserRepository.getUser()!.executeGraphqlQueryInCompany<{
        salesActivityList: PaginationResponseType<SalesActivityType>;
      }>({
        operation: "salesActivityList",
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields([
          ...["id", "disabled", "name", "initial", "description", "duration"],
        ]),
      })!;
      return response.salesActivityList;
    },
    [
      new EnumFilter(
        "status",
        "SalesActivity.disabled",
        () => [
          { label: "active", value: false },
          { label: "disabled", value: true },
        ],
        "select status ..."
      ),
    ],
    new KeywordSearch(["SalesActivity.name", "SalesActivity.description"])
  )
);

onMounted(async () => {
  await pagination.loadPage();
});

const disableCallback = (salesActivityId: string) => async () => {
  const response = await companyUserRepository
    .getUser()!
    .executeGraphqlMutationInCompany<{ disableSalesActivity: SalesActivityType }>({
      operation: "disableSalesActivity",
      variables: { id: { type: "ID", value: salesActivityId } },
      fields: ["disabled"],
    });
  pagination.resultList.find(
    (salesActivity: SalesActivityType) => salesActivity.id === salesActivityId
  )!.disabled = response.disableSalesActivity.disabled;
};
const enableCallback = (salesActivityId: string) => async () => {
  const response = await companyUserRepository
    .getUser()!
    .executeGraphqlMutationInCompany<{ enableSalesActivity: SalesActivityType }>({
      operation: "enableSalesActivity",
      variables: { id: { type: "ID", value: salesActivityId } },
      fields: ["disabled"],
    });
  pagination.resultList.find(
    (salesActivity: SalesActivityType) => salesActivity.id === salesActivityId
  )!.disabled = response.enableSalesActivity.disabled;
};
</script>

<style lang="scss" scoped></style>
