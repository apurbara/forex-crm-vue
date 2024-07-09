<template>
  <h1 class="page-title">Common Sales Metric List</h1>
  <OffsetPaginationComponent :pagination="pagination">
    <template v-slot:editSection>
      <v-btn prepend-icon="mdi-account-plus-outline" variant="tonal" to="/common-sales-metric/add">Add
        Common Sales Metric</v-btn>
    </template>
    <v-table height="400px" density="compact" style="width: 100%;" class="datatable">
      <thead>
        <tr>
          <th>name</th>
          <th>metric type</th>
          <th>evaluation type</th>
          <th>recurrence type</th>
          <th>recurrence count</th>
          <th>target</th>
          <th>last modified time</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="pagination.resultList.length < 1">
          <td class="no-data" colspan="12">
            <div class="justify-center text-center pa-5">
              <img src="@/assets/images/image-no-data.svg" alt="No Data" /><br /><br />
              <span class="text-disabled text-body-1">Data Common Sales Metric kosong</span>
            </div>
          </td>
        </tr>
        <tr v-else v-for="(commonSalesMetric, index) in pagination.resultList" :key="commonSalesMetric.id ?? index"
          @dblclick="toDetail(commonSalesMetric.id!)">
          <td>{{ commonSalesMetric.name }}</td>
          <td>{{ commonSalesMetric.metricType }}</td>
          <td>{{ commonSalesMetric.evaluationType }}</td>
          <td>{{ commonSalesMetric.recurrenceType }}</td>
          <td>{{ commonSalesMetric.recurrenceCount }}</td>
          <td>{{ thousandSeparator(commonSalesMetric.target ?? 0) }}</td>
          <td>{{ new Date(commonSalesMetric.lastModifiedTime!).toLocaleDateString() }}</td>
          <td>
            <v-btn color="green" v-if="!commonSalesMetric.disabled" variant="text" icon="mdi-toggle-switch-outline"
              @click="disableConfirmation($event, commonSalesMetric.id!)"></v-btn>
            <v-btn color="red" v-else variant="text" icon="mdi-toggle-switch-off-outline"
              @click="enableConfirmation($event, commonSalesMetric.id!)"></v-btn>
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
import { CommonSalesMetricType } from '@/company-bc/domain/model/common-sales-metric';
import { useThousandSeparator } from '@/resources/composables/typography';

const { httpRequest, companyUserRepository } = useDependencyInjection()
const router = useRouter();
const confirm = useConfirm();

const thousandSeparator = (value: number) => useThousandSeparator(value);

const pagination = reactive(new OffsetPagination<CommonSalesMetricType>(
  async (pagination) => {
    const response = await companyUserRepository.getUser()!
      .executeGraphqlQueryInCompany<{ viewCommonSalesMetricList: PaginationResponseType<CommonSalesMetricType> }>({
        operation: 'viewCommonSalesMetricList',
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields([
          'id', 'disabled', 'lastModifiedTime', 'name', 'target', 'metricType', 'evaluationType', 'recurrenceType', 'recurrenceCount'
        ])
      })!
    return response.viewCommonSalesMetricList;
  },
  [
    new EnumFilter('status', 'CommonSalesMetric.disabled', () => [{ label: 'active', value: false }, { label: 'disabled', value: true }], 'select status ...')
  ],
  new KeywordSearch(["CommonSalesMetric.name", "CommonSalesMetric.description"])
))

onMounted(async () => {
  await pagination.loadPage();
})

const toDetail = (commonsalesmetricId: string) => router.push(`/common-sales-metric/${commonsalesmetricId}`)

const disableConfirmation = (event: Event, commonSalesMetricId: string) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to disable this metric?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const response = await companyUserRepository.getUser()!
        .executeGraphqlMutationInCompany<{ disableCommonSalesMetric: CommonSalesMetricType }>({
          operation: "disableCommonSalesMetric",
          variables: { id: { type: "ID", value: commonSalesMetricId } },
          fields: ['disabled']
        })
      pagination.resultList.find(
        (commonSalesMetric: CommonSalesMetricType) => commonSalesMetric.id === commonSalesMetricId
      )!.disabled = response.disableCommonSalesMetric.disabled
    },
    reject: () => { }
  });
};
const enableConfirmation = (event: Event, commonSalesMetricId: string) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to enable this metric?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const response = await companyUserRepository.getUser()!
        .executeGraphqlMutationInCompany<{ enableCommonSalesMetric: CommonSalesMetricType }>({
          operation: "enableCommonSalesMetric",
          variables: { id: { type: "ID", value: commonSalesMetricId } },
          fields: ['disabled']
        })
      pagination.resultList.find(
        (commonSalesMetric: CommonSalesMetricType) => commonSalesMetric.id === commonSalesMetricId
      )!.disabled = response.enableCommonSalesMetric.disabled
    },
    reject: () => { }
  });
};

</script>

<style lang="scss" scoped></style>