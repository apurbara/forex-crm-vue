<template>
  <div class="page-section">
    <h1 class="page-title">Individual Target</h1>
    <OffsetPaginationComponent :pagination="pagination">
      <template v-slot:editSection>
        <v-btn
          prepend-icon="mdi-account-plus-outline"
          variant="tonal"
          to="/company/common-sales-metric/add"
          >Add Individual Target</v-btn
        >
      </template>
      <EmptyDataIllustrationComponent
        class="w-full"
        v-if="pagination.resultList.length < 1"
        message="Data Individual Target Kosong"
      />
      <DataTable v-else :value="pagination.resultList" size="small" class="w-full">
        <Column field="name" header="Name"></Column>
        <Column field="metricType" header="Metric Type"></Column>
        <Column field="evaluationType" header="Evaluation Type"></Column>
        <Column field="recurrenceType" header="Recurrence Type"></Column>
        <Column field="recurrenceCount" header="Recurrence Count"></Column>
        <Column :field="(metric) => thousandSeparator(metric.target ?? 0)" header="Target"></Column>
        <Column
          :field="(metric) => new Date(metric.lastModifiedTime!).toLocaleDateString()"
          header="Last Edit"
        ></Column>
        <Column>
          <template #body="{ data }">
            <DataTableActionComponent
              :value="data.disabled"
              :detail-path="`/company/common-sales-metric/${data.id}`"
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
import { CommonSalesMetricType } from "@/company-bc/domain/model/common-sales-metric";
import { useThousandSeparator } from "@/resources/composables/typography";
import EmptyDataIllustrationComponent from "@/shared/components/EmptyDataIllustrationComponent.vue";
import DataTableActionComponent from "@/shared/components/data-table-action-component.vue";

const { companyUserRepository } = useDependencyInjection();

const thousandSeparator = (value: number) => useThousandSeparator(value);

const pagination = reactive(
  new OffsetPagination<CommonSalesMetricType>(
    async (pagination) => {
      const response = await companyUserRepository.getUser()!.executeGraphqlQueryInCompany<{
        viewCommonSalesMetricList: PaginationResponseType<CommonSalesMetricType>;
      }>({
        operation: "viewCommonSalesMetricList",
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields([
          ...["id", "disabled", "lastModifiedTime", "name", "target"],
          ...["metricType", "evaluationType", "recurrenceType", "recurrenceCount"],
        ]),
      })!;
      return response.viewCommonSalesMetricList;
    },
    [
      new EnumFilter(
        "status",
        "CommonSalesMetric.disabled",
        () => [
          { label: "active", value: false },
          { label: "disabled", value: true },
        ],
        "select status ..."
      ),
    ],
    new KeywordSearch(["CommonSalesMetric.name", "CommonSalesMetric.description"])
  )
);

onMounted(async () => {
  await pagination.loadPage();
});

const disableCallback = (commonSalesMetricId: string) => async () => {
  const response = await companyUserRepository
    .getUser()!
    .executeGraphqlMutationInCompany<{ disableCommonSalesMetric: CommonSalesMetricType }>({
      operation: "disableCommonSalesMetric",
      variables: { id: { type: "ID", value: commonSalesMetricId } },
      fields: ["disabled"],
    });
  pagination.resultList.find(
    (commonSalesMetric: CommonSalesMetricType) => commonSalesMetric.id === commonSalesMetricId
  )!.disabled = response.disableCommonSalesMetric.disabled;
};

const enableCallback = (commonSalesMetricId: string) => async () => {
  const response = await companyUserRepository
    .getUser()!
    .executeGraphqlMutationInCompany<{ enableCommonSalesMetric: CommonSalesMetricType }>({
      operation: "enableCommonSalesMetric",
      variables: { id: { type: "ID", value: commonSalesMetricId } },
      fields: ["disabled"],
    });
  pagination.resultList.find(
    (commonSalesMetric: CommonSalesMetricType) => commonSalesMetric.id === commonSalesMetricId
  )!.disabled = response.enableCommonSalesMetric.disabled;
};
</script>

<style lang="scss" scoped></style>
