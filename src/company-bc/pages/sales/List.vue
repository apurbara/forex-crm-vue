<template>
  <div class="page-section">
    <h1 class="page-title">Sales List</h1>
    <OffsetPaginationComponent :pagination="pagination">
      <template v-slot:editSection>
        <v-btn
          class="ml-2"
          prepend-icon="mdi-account-plus-outline"
          variant="tonal"
          to="/company/sales/add"
          >Add Sales</v-btn
        >
      </template>
      <EmptyDataIllustrationComponent
        class="w-full"
        v-if="pagination.resultList.length < 1"
        message="Data Sales Kosong"
      />
      <DataTable v-else :value="pagination.resultList" size="small" class="w-full">
        <Column field="name" header="Name"></Column>
        <Column :field="(sales) => sales.manager.name" header="Manager"></Column>
        <Column field="email" header="Email"></Column>
        <Column field="type" header="Type"></Column>
        <Column
          :field="(sales) => new Date(sales.createdTime!).toLocaleDateString()"
          header="Created Time"
        ></Column>
        <Column
          :field="
            (sales) =>
              sales.contractTerminatedTime
                ? new Date(sales.contractTerminatedTime).toLocaleDateString()
                : 'N/A'
          "
          header="Contract Terminated Time"
        ></Column>
        <Column>
          <template #body="{ data }">
            <DataTableActionComponent
              :value="data.contractTerminated"
              :detail-path="`/company/sales/${data.id}`"
              :disable-callback="terminateContractCallback(data.id)"
              disable-message="do you really want to terminate this sales contract"
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
import { useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { SalesType } from "@/company-bc/domain/model/sales";
import EmptyDataIllustrationComponent from "@/shared/components/EmptyDataIllustrationComponent.vue";
import DataTableActionComponent from "@/shared/components/data-table-action-component.vue";

const { companyUserRepository } = useDependencyInjection();
const router = useRouter();
const confirm = useConfirm();

const pagination = reactive(
  new OffsetPagination<SalesType>(
    async (pagination) => {
      const response = await companyUserRepository.getUser()!.executeGraphqlQueryInCompany<{
        viewSalesList: PaginationResponseType<SalesType>;
      }>({
        operation: "viewSalesList",
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields([
          "id",
          "contractTerminated",
          "name",
          "email",
          "createdTime",
          "contractTerminatedTime",
          "type",
          { manager: ["name"] },
        ]),
      })!;
      return response.viewSalesList;
    },
    [
      new EnumFilter(
        "status",
        "Sales.contractTerminated",
        () => [
          { label: "active", value: false },
          { label: "contract terminated", value: true },
        ],
        "select status ..."
      ),
    ],
    new KeywordSearch(["Sales.name", "Sales.email"])
  )
);

onMounted(async () => {
  await pagination.loadPage();
});

const terminateContractCallback = (salesId: string) => async () => {
  const response = await companyUserRepository
    .getUser()!
    .executeGraphqlMutationInCompany<{ terminateSalesContract: SalesType }>({
      operation: "terminateSalesContract",
      variables: { id: { type: "ID", value: salesId } },
      fields: ["contractTerminated", "contractTerminatedTime"],
    });
  pagination.resultList.find((sales: SalesType) => sales.id === salesId)!.contractTerminatedTime =
    response.terminateSalesContract.contractTerminatedTime;
  pagination.resultList.find((sales: SalesType) => sales.id === salesId)!.contractTerminated =
    response.terminateSalesContract.contractTerminated;
};
</script>

<style lang="scss" scoped></style>
