<template>
  <div class="page-section">
    <h1 class="page-title">Metric List</h1>
    <OffsetPaginationComponent :pagination="pagination">
      <template v-slot:editSection>
        <v-btn
          prepend-icon="mdi-account-plus-outline"
          variant="tonal"
          to="/company/sales-performance-metric/add"
          >Add Metric</v-btn
        >
      </template>
      <EmptyDataIllustrationComponent
        class="w-full"
        v-if="pagination.resultList.length < 1"
        message="Data Metric Kosong"
      />
      <DataTable v-else :value="pagination.resultList" size="small" class="w-full">
        <Column field="name" header="Name"></Column>
        <Column field="metricType" header="Metric Type"></Column>
        <Column field="recurrenceType" header="Recurrence Type"></Column>
        <Column field="recurrenceCount" header="Recurrence Count"></Column>
        <Column
          :field="(metric) => new Date(metric.lastModifiedTime!).toLocaleDateString()"
          header="Last Edit"
        ></Column>
        <Column>
          <template #body="{ data }">
            <DataTableActionComponent
              :value="data.disabled"
              :detail-path="`/company/sales-performance-metric/${data.id}`"
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
import { useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { SalesPerformanceMetricType } from "@/company-bc/domain/model/sales-performance-metric";
import EmptyDataIllustrationComponent from "@/shared/components/EmptyDataIllustrationComponent.vue";
import DataTableActionComponent from "@/shared/components/data-table-action-component.vue";

const { companyUserRepository } = useDependencyInjection();
const router = useRouter();
const confirm = useConfirm();

const pagination = reactive(
  new OffsetPagination<SalesPerformanceMetricType>(
    async (pagination) => {
      const response = await companyUserRepository.getUser()!.executeGraphqlQueryInCompany<{
        viewSalesPerformanceMetricList: PaginationResponseType<SalesPerformanceMetricType>;
      }>({
        operation: "viewSalesPerformanceMetricList",
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields([
          ...["id", "disabled", "lastModifiedTime", "name"],
          ...["metricType", "recurrenceType", "recurrenceCount"],
          { evaluations: ["alias", "evaluationType"] },
        ]),
      })!;
      return response.viewSalesPerformanceMetricList;
    },
    [
      new EnumFilter(
        "status",
        "SalesPerformanceMetric.disabled",
        () => [
          { label: "active", value: false },
          { label: "disabled", value: true },
        ],
        "select status ..."
      ),
    ],
    new KeywordSearch(["SalesPerformanceMetric.name", "SalesPerformanceMetric.description"])
  )
);

onMounted(async () => {
  await pagination.loadPage();
});

const disableCallback = (salesPerformanceMetricId: string) => async () => {
  const response = await companyUserRepository.getUser()!.executeGraphqlMutationInCompany<{
    disableSalesPerformanceMetric: SalesPerformanceMetricType;
  }>({
    operation: "disableSalesPerformanceMetric",
    variables: { id: { type: "ID", value: salesPerformanceMetricId } },
    fields: ["disabled"],
  });
  pagination.resultList.find(
    (salesPerformanceMetric: SalesPerformanceMetricType) =>
      salesPerformanceMetric.id === salesPerformanceMetricId
  )!.disabled = response.disableSalesPerformanceMetric.disabled;
};
const enableCallback = (salesPerformanceMetricId: string) => async () => {
  const response = await companyUserRepository.getUser()!.executeGraphqlMutationInCompany<{
    enableSalesPerformanceMetric: SalesPerformanceMetricType;
  }>({
    operation: "enableSalesPerformanceMetric",
    variables: { id: { type: "ID", value: salesPerformanceMetricId } },
    fields: ["disabled"],
  });
  pagination.resultList.find(
    (salesPerformanceMetric: SalesPerformanceMetricType) =>
      salesPerformanceMetric.id === salesPerformanceMetricId
  )!.disabled = response.enableSalesPerformanceMetric.disabled;
};
</script>

<style lang="scss" scoped></style>
