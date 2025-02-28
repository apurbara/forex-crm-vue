<template>
  <h1 class="page-title">Sales Rank List</h1>
  <OffsetPaginationComponent :pagination="pagination">
    <template v-slot:editSection>
      <v-btn prepend-icon="mdi-account-plus-outline" variant="tonal" to="/sales-rank/add">Add
        Sales Rank</v-btn>
    </template>
    <v-table height="400px" density="compact" style="width: 100%;" class="datatable">
      <thead>
        <tr>
          <th>name</th>
          <th>metric type</th>
          <th>evaluation type</th>
          <th>recurrence type</th>
          <th>query order</th>
          <th>display sales number</th>
          <th>last modified time</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="pagination.resultList.length < 1">
          <td class="no-data" colspan="12">
            <div class="justify-center text-center pa-5">
              <img src="@/assets/images/image-no-data.svg" alt="No Data" /><br /><br />
              <span class="text-disabled text-body-1">Data Sales Rank kosong</span>
            </div>
          </td>
        </tr>
        <tr v-else v-for="(salesRank, index) in pagination.resultList" :key="salesRank.id ?? index"
          @dblclick="toDetail(salesRank.id!)">
          <td>{{ salesRank.name }}</td>
          <td>{{ salesRank.metricType }}</td>
          <td>{{ salesRank.evaluationType }}</td>
          <td>{{ salesRank.recurrenceType }}</td>
          <td>{{ salesRank.queryOrder }}</td>
          <td>{{ salesRank.displaySalesNumber }}</td>
          <td>{{ new Date(salesRank.lastModifiedTime!).toLocaleDateString() }}</td>
          <td>
            <v-btn color="green" v-if="!salesRank.disabled" variant="text" icon="mdi-toggle-switch-outline"
              @click="disableConfirmation($event, salesRank.id!)"></v-btn>
            <v-btn color="red" v-else variant="text" icon="mdi-toggle-switch-off-outline"
              @click="enableConfirmation($event, salesRank.id!)"></v-btn>
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
import { SalesRankType } from '@/company-bc/domain/model/sales-rank';

const { companyUserRepository } = useDependencyInjection()
const router = useRouter();
const confirm = useConfirm();

const pagination = reactive(new OffsetPagination<SalesRankType>(
  async (pagination) => {
    const response = await companyUserRepository.getUser()!
      .executeGraphqlQueryInCompany<{ viewSalesRankList: PaginationResponseType<SalesRankType> }>({
        operation: 'viewSalesRankList',
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields([
          'id', 'disabled', 'lastModifiedTime', 'name', 'displaySalesNumber', 'metricType',
          'evaluationType', 'recurrenceType', 'queryOrder'
        ])
      })!
    return response.viewSalesRankList;
  },
  [
    new EnumFilter('status', 'SalesRank.disabled', () => [{ label: 'active', value: false }, { label: 'disabled', value: true }], 'select status ...')
  ],
  new KeywordSearch(["SalesRank.name", "SalesRank.description"])
))

onMounted(async () => {
  await pagination.loadPage();
})

const toDetail = (salesrankId: string) => router.push(`/sales-rank/${salesrankId}`)

const disableConfirmation = (event: Event, salesRankId: string) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to disable this sales rank?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const response = await companyUserRepository.getUser()!
        .executeGraphqlMutationInCompany<{ disableSalesRank: SalesRankType }>({
          operation: "disableSalesRank",
          variables: { id: { type: "ID", value: salesRankId } },
          fields: ['disabled']
        })
      pagination.resultList.find(
        (salesRank: SalesRankType) => salesRank.id === salesRankId
      )!.disabled = response.disableSalesRank.disabled
    },
    reject: () => { }
  });
};
const enableConfirmation = (event: Event, salesRankId: string) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to enable this sales rank?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const response = await companyUserRepository.getUser()!
        .executeGraphqlMutationInCompany<{ enableSalesRank: SalesRankType }>({
          operation: "enableSalesRank",
          variables: { id: { type: "ID", value: salesRankId } },
          fields: ['disabled']
        })
      pagination.resultList.find(
        (salesRank: SalesRankType) => salesRank.id === salesRankId
      )!.disabled = response.enableSalesRank.disabled
    },
    reject: () => { }
  });
};

</script>

<style lang="scss" scoped></style>