<template>
  <h1 class="page-title">Company Metric List</h1>
  <OffsetPaginationComponent :pagination="pagination">
    <template v-slot:editSection>
      <v-btn prepend-icon="mdi-account-plus-outline" variant="tonal" to="/company-metric/add">Add
        Company Metric</v-btn>
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
              <span class="text-disabled text-body-1">Data Company Metric kosong</span>
            </div>
          </td>
        </tr>
        <tr v-else v-for="(companyMetric, index) in pagination.resultList" :key="companyMetric.id ?? index"
          @dblclick="toDetail(companyMetric.id!)">
          <td>{{ companyMetric.name }}</td>
          <td>{{ companyMetric.metricType }}</td>
          <td>{{ companyMetric.evaluationType }}</td>
          <td>{{ companyMetric.recurrenceType }}</td>
          <td>{{ companyMetric.recurrenceCount }}</td>
          <td>{{ companyMetric.target }}</td>
          <td>{{ new Date(companyMetric.lastModifiedTime!).toLocaleDateString() }}</td>
          <td>
            <v-btn color="green" v-if="!companyMetric.disabled" variant="text" icon="mdi-toggle-switch-outline"
              @click="disableConfirmation($event, companyMetric)"></v-btn>
            <v-btn color="red" v-else variant="text" icon="mdi-toggle-switch-off-outline"
              @click="enableConfirmation($event, companyMetric)"></v-btn>
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
import { CompanyMetricType } from '@/company-bc/domain/model/company-metric';

const { httpRequest, companyUserRepository } = useDependencyInjection()
const router = useRouter();
const confirm = useConfirm();

const pagination = reactive(new OffsetPagination<CompanyMetricType>(
  async (pagination) => {
    const response = await companyUserRepository.getUser()!
      .executeGraphqlQueryInCompany<{ viewCompanyMetricList: PaginationResponseType<CompanyMetricType> }>({
        operation: 'viewCompanyMetricList',
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields([
          'id', 'disabled', 'lastModifiedTime', 'name', 'target', 'metricType', 'evaluationType', 'recurrenceType', 'recurrenceCount'
        ])
      })!
    return response.viewCompanyMetricList;
  },
  [
    new EnumFilter('disabled', 'CompanyMetric.disabled', () => [{ status: true, name: 'disabled' }, { status: false, name: 'active' }], 'IN', undefined, 'name', 'status'),
  ],
  new KeywordSearch(["CompanyMetric.name", "CompanyMetric.description"])
))

onMounted(async () => {
  await pagination.loadPage();
})

const toDetail = (companymetricId: string) => router.push(`/company-metric/${companymetricId}`)

const disableConfirmation = (event: Event, companyMetric: CompanyMetricType) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to disable this metric?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const response = await companyUserRepository.getUser()!
        .executeGraphqlMutationInCompany<{ disableCompanyMetric: CompanyMetricType }>({
          operation: "disableCompanyMetric",
          variables: { id: { type: "ID", value: companyMetric.id } },
          fields: ['disabled']
        })
      companyMetric.disabled = response.disableCompanyMetric.disabled;
    },
    reject: () => { }
  });
};
const enableConfirmation = (event: Event, companyMetric: CompanyMetricType) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to enable this metric?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const response = await companyUserRepository.getUser()!
        .executeGraphqlMutationInCompany<{ enableCompanyMetric: CompanyMetricType }>({
          operation: "enableCompanyMetric",
          variables: { id: { type: "ID", value: companyMetric.id } },
          fields: ['disabled']
        })
      companyMetric.disabled = response.enableCompanyMetric.disabled;
    },
    reject: () => { }
  });
};

</script>

<style lang="scss" scoped></style>