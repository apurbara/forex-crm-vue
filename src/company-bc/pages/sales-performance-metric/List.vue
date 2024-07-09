<template>
  <h1 class="page-title">Sales Performance Metric List</h1>
  <OffsetPaginationComponent :pagination="pagination">
    <template v-slot:editSection>
      <v-btn prepend-icon="mdi-account-plus-outline" variant="tonal" to="/sales-performance-metric/add">Add
        Sales Performance Metric</v-btn>
    </template>
    <v-table height="400px" density="compact" style="width: 100%;" class="datatable">
      <thead>
        <tr>
          <th>name</th>
          <th>metric type</th>
          <th>recurrence type</th>
          <th>recurrence count</th>
          <th>last modified time</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="pagination.resultList.length < 1">
          <td class="no-data" colspan="12">
            <div class="justify-center text-center pa-5">
              <img src="@/assets/images/image-no-data.svg" alt="No Data" /><br /><br />
              <span class="text-disabled text-body-1">Data Sales Performance Metric kosong</span>
            </div>
          </td>
        </tr>
        <tr v-else v-for="(salesPerformanceMetric, index) in pagination.resultList"
          :key="salesPerformanceMetric.id ?? index" @dblclick="toDetail(salesPerformanceMetric.id!)">
          <td>{{ salesPerformanceMetric.name }}</td>
          <td>{{ salesPerformanceMetric.metricType }}</td>
          <td>{{ salesPerformanceMetric.recurrenceType }}</td>
          <td>{{ salesPerformanceMetric.recurrenceCount }}</td>
          <td>{{ new Date(salesPerformanceMetric.lastModifiedTime!).toLocaleDateString() }}</td>
          <td>
            <v-btn color="green" v-if="!salesPerformanceMetric.disabled" variant="text" icon="mdi-toggle-switch-outline"
              @click="disableConfirmation($event, salesPerformanceMetric.id!)"></v-btn>
            <v-btn color="red" v-else variant="text" icon="mdi-toggle-switch-off-outline"
              @click="enableConfirmation($event, salesPerformanceMetric.id!)"></v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </OffsetPaginationComponent>
</template>

<script lang="ts" setup>
import OffsetPaginationComponent from '@/resources/components/OffsetPaginationComponent.vue';
import { KeywordSearch, PaginationResponseType } from '@/resources/components/abstract-pagination';
import OffsetPagination from '@/resources/components/offset-pagination';
import EnumFilter from '@/resources/components/pagination/enum-filter';
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useConfirm } from "primevue/useconfirm";
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { SalesPerformanceMetricType } from '@/company-bc/domain/model/sales-performance-metric';

const { companyUserRepository } = useDependencyInjection()
const router = useRouter();
const confirm = useConfirm();

const pagination = reactive(new OffsetPagination<SalesPerformanceMetricType>(
  async (pagination) => {
    const response = await companyUserRepository.getUser()!
      .executeGraphqlQueryInCompany<{ viewSalesPerformanceMetricList: PaginationResponseType<SalesPerformanceMetricType> }>({
        operation: 'viewSalesPerformanceMetricList',
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields([
          'id', 'disabled', 'lastModifiedTime', 'name', 'metricType', 'recurrenceType', 'recurrenceCount',
          { evaluations: ['alias', 'evaluationType'] }
        ])
      })!
    return response.viewSalesPerformanceMetricList;
  },
  [
    new EnumFilter('status', 'SalesPerformanceMetric.disabled', () => [{ label: 'active', value: false }, { label: 'disabled', value: true }], 'select status ...')
  ],
  new KeywordSearch(["SalesPerformanceMetric.name", "SalesPerformanceMetric.description"])
))

onMounted(async () => {
  await pagination.loadPage();
})

const toDetail = (salesperformancemetricId: string) => router.push(`/sales-performance-metric/${salesperformancemetricId}`)

const disableConfirmation = (event: Event, salesPerformanceMetricId: string) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to disable this metric?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const response = await companyUserRepository.getUser()!
        .executeGraphqlMutationInCompany<{ disableSalesPerformanceMetric: SalesPerformanceMetricType }>({
          operation: "disableSalesPerformanceMetric",
          variables: { id: { type: "ID", value: salesPerformanceMetricId } },
          fields: ['disabled']
        })
      pagination.resultList.find(
        (salesPerformanceMetric: SalesPerformanceMetricType) => salesPerformanceMetric.id === salesPerformanceMetricId
      )!.disabled = response.disableSalesPerformanceMetric.disabled
    },
    reject: () => { }
  });
};
const enableConfirmation = (event: Event, salesPerformanceMetricId: string) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to enable this metric?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const response = await companyUserRepository.getUser()!
        .executeGraphqlMutationInCompany<{ enableSalesPerformanceMetric: SalesPerformanceMetricType }>({
          operation: "enableSalesPerformanceMetric",
          variables: { id: { type: "ID", value: salesPerformanceMetricId } },
          fields: ['disabled']
        })
      pagination.resultList.find(
        (salesPerformanceMetric: SalesPerformanceMetricType) => salesPerformanceMetric.id === salesPerformanceMetricId
      )!.disabled = response.enableSalesPerformanceMetric.disabled
    },
    reject: () => { }
  });
};

</script>

<style lang="scss" scoped></style>