<template>
  <div class="page-section">
    <h1 class="page-title">Sales Rank Config List</h1>
    <OffsetPaginationComponent :pagination="pagination">
      <template v-slot:editSection>
        <v-btn prepend-icon="mdi-account-plus-outline" variant="tonal" to="/company/sales-rank/add"
          >Add Sales Rank Config</v-btn
        >
      </template>
      <EmptyDataIllustrationComponent
        class="w-full"
        v-if="pagination.resultList.length < 1"
        message="Data Sales Rank Config Kosong"
      />
      <DataTable v-else :value="pagination.resultList" size="small" class="w-full">
        <Column field="name" header="Name"></Column>
        <Column field="metricType" header="Metric Type"></Column>
        <Column field="evaluationType" header="Evaluation Type"></Column>
        <Column field="recurrenceType" header="Recurrence Type"></Column>
        <Column field="queryOrder" header="Order"></Column>
        <Column field="displaySalesNumber" header="Display Number"></Column>
        <Column
          :field="(metric) => new Date(metric.lastModifiedTime!).toLocaleDateString()"
          header="Last Edit"
        ></Column>
        <Column>
          <template #body="{ data }">
            <DataTableActionComponent
              :value="data.disabled"
              :detail-path="`/company/sales-rank/${data.id}`"
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
import { SalesRankType } from "@/company-bc/domain/model/sales-rank";
import DataTableActionComponent from "@/shared/components/data-table-action-component.vue";
import EmptyDataIllustrationComponent from "@/shared/components/EmptyDataIllustrationComponent.vue";

const { companyUserRepository } = useDependencyInjection();

const pagination = reactive(
  new OffsetPagination<SalesRankType>(
    async (pagination) => {
      const response = await companyUserRepository
        .getUser()!
        .executeGraphqlQueryInCompany<{ viewSalesRankList: PaginationResponseType<SalesRankType> }>(
          {
            operation: "viewSalesRankList",
            variables: pagination.toGraphqlVariables(),
            fields: OffsetPagination.wrapResultFields([
              ...["id", "disabled", "lastModifiedTime", "name", "displaySalesNumber"],
              ...["metricType", "evaluationType", "recurrenceType", "queryOrder"],
            ]),
          }
        )!;
      return response.viewSalesRankList;
    },
    [
      new EnumFilter(
        "status",
        "SalesRank.disabled",
        () => [
          { label: "active", value: false },
          { label: "disabled", value: true },
        ],
        "select status ..."
      ),
    ],
    new KeywordSearch(["SalesRank.name", "SalesRank.description"])
  )
);

onMounted(async () => {
  await pagination.loadPage();
});

const disableCallback = (salesRankId: string) => async () => {
  const response = await companyUserRepository
    .getUser()!
    .executeGraphqlMutationInCompany<{ disableSalesRank: SalesRankType }>({
      operation: "disableSalesRank",
      variables: { id: { type: "ID", value: salesRankId } },
      fields: ["disabled"],
    });
  pagination.resultList.find((salesRank: SalesRankType) => salesRank.id === salesRankId)!.disabled =
    response.disableSalesRank.disabled;
};
const enableCallback = (salesRankId: string) => async () => {
  const response = await companyUserRepository
    .getUser()!
    .executeGraphqlMutationInCompany<{ enableSalesRank: SalesRankType }>({
      operation: "enableSalesRank",
      variables: { id: { type: "ID", value: salesRankId } },
      fields: ["disabled"],
    });
  pagination.resultList.find((salesRank: SalesRankType) => salesRank.id === salesRankId)!.disabled =
    response.enableSalesRank.disabled;
};
</script>

<style lang="scss" scoped></style>
