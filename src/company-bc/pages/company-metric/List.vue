<template>
  <div class="page-section">
    <h1 class="page-title">Team Target</h1>
    <OffsetPaginationComponent :pagination="pagination">
      <template v-slot:editSection>
        <v-btn
          prepend-icon="mdi-account-plus-outline"
          variant="tonal"
          to="/company/company-metric/add"
          >Add Team Target</v-btn
        >
      </template>
      <EmptyDataIllustrationComponent
        class="w-full"
        v-if="pagination.resultList.length < 1"
        message="Data Team Target Kosong"
      />
      <DataTable v-else :value="pagination.resultList" size="small" class="w-full">
        <Column field="name" header="Name"></Column>
        <Column field="metricType" header="Metric Type"></Column>
        <Column field="evaluationType" header="Evaluation Type"></Column>
        <Column field="recurrenceType" header="Recurrence Type"></Column>
        <Column field="recurrenceCount" header="Recurrence Count"></Column>
        <Column
          :field="(metric) => useThousandSeparator(metric.target ?? 0)"
          header="Target"
        ></Column>
        <Column
          :field="(metric) => new Date(metric.lastModifiedTime!).toLocaleDateString()"
          header="Last Edit"
        ></Column>
        <Column>
          <template #body="{ data }">
            <DataTableActionComponent
              :value="data.disabled"
              :detail-path="`/company/company-metric/${data.id}`"
              :enable-callback="enableCallback(data)"
              :enable-message="`do you really want to enable ${data.name}`"
              :disable-callback="disableCallback(data)"
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
import { CompanyMetricType } from "@/company-bc/domain/model/company-metric";
import { useThousandSeparator } from "@/resources/composables/typography";
import EmptyDataIllustrationComponent from "@/shared/components/EmptyDataIllustrationComponent.vue";
import DataTableActionComponent from "@/shared/components/data-table-action-component.vue";

const { companyUserRepository } = useDependencyInjection();

const pagination = reactive(
  new OffsetPagination<CompanyMetricType>(
    async (pagination) => {
      const response = await companyUserRepository.getUser()!.executeGraphqlQueryInCompany<{
        viewCompanyMetricList: PaginationResponseType<CompanyMetricType>;
      }>({
        operation: "viewCompanyMetricList",
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields([
          ...["id", "disabled", "lastModifiedTime", "name", "target"],
          ...["metricType", "evaluationType", "recurrenceType", "recurrenceCount"],
        ]),
      })!;
      return response.viewCompanyMetricList;
    },
    [
      new EnumFilter(
        "status",
        "CompanyMetric.disabled",
        () => [
          { label: "active", value: false },
          { label: "disabled", value: true },
        ],
        "select status ..."
      ),
    ],
    new KeywordSearch(["CompanyMetric.name", "CompanyMetric.description"])
  )
);

onMounted(async () => {
  await pagination.loadPage();
});

const disableCallback = (companyMetric: CompanyMetricType) => async () => {
  const response = await companyUserRepository
    .getUser()!
    .executeGraphqlMutationInCompany<{ disableCompanyMetric: CompanyMetricType }>({
      operation: "disableCompanyMetric",
      variables: { id: { type: "ID", value: companyMetric.id } },
      fields: ["disabled"],
    });
  companyMetric.disabled = response.disableCompanyMetric.disabled;
};
const enableCallback = (companyMetric: CompanyMetricType) => async () => {
  const response = await companyUserRepository
    .getUser()!
    .executeGraphqlMutationInCompany<{ enableCompanyMetric: CompanyMetricType }>({
      operation: "enableCompanyMetric",
      variables: { id: { type: "ID", value: companyMetric.id } },
      fields: ["disabled"],
    });
  companyMetric.disabled = response.enableCompanyMetric.disabled;
};
</script>

<style lang="scss" scoped></style>
