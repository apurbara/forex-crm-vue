<template>
  <h1 class="page-title">Sales List</h1>
  <OffsetPaginationComponent :pagination="pagination">
    <template v-slot:editSection>
      <v-btn class="ml-2" prepend-icon="mdi-account-plus-outline" variant="tonal" to="/sales/add">Add
        Sales</v-btn>
    </template>
    <v-table height="400px" density="compact" style="width: 100%;" class="datatable">
      <thead>
        <tr>
          <th>name</th>
          <th>manager</th>
          <th>email</th>
          <th>type</th>
          <th>createdTime</th>
          <th>contract terminated time</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="pagination.resultList.length < 1">
          <td class="no-data" colspan="12">
            <div class="justify-center text-center pa-5">
              <img src="@/assets/images/image-no-data.svg" alt="No Data" /><br /><br />
              <span class="text-disabled text-body-1">Data Sales kosong</span>
            </div>
          </td>
        </tr>
        <tr v-else v-for="(sales, index) in pagination.resultList" :key="sales.id ?? index"
          @dblclick="toDetail(sales.id!)">
          <td>{{ sales.name }}</td>
          <td>{{ sales.manager?.name }}</td>
          <td>{{ sales.email }}</td>
          <td>{{ sales.type }}</td>
          <td>{{ new Date(sales.createdTime!).toLocaleDateString() }}</td>
          <td>{{ sales.contractTerminatedTime ? new Date(sales.contractTerminatedTime).toLocaleDateString() : '' }}</td>
          <td>
            <v-btn color="green" v-if="!sales.contractTerminated" variant="text" icon="mdi-toggle-switch-outline"
              @click="terminateContractConfirmation($event, sales.id!)"></v-btn>
            <v-btn color="red" v-else variant="text" icon="mdi-toggle-switch-off-outline" disabled></v-btn>
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
import { SalesType } from '@/company-bc/domain/model/sales';

const { companyUserRepository } = useDependencyInjection()
const router = useRouter();
const confirm = useConfirm();

const pagination = reactive(new OffsetPagination<SalesType>(
  async (pagination) => {
    const response = await companyUserRepository.getUser()!
      .executeGraphqlQueryInCompany<{ viewSalesList: PaginationResponseType<SalesType> }>({
        operation: 'viewSalesList',
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields([
          'id', 'contractTerminated', 'name', 'email', 'createdTime', 'contractTerminatedTime', 'type',
          { manager: ["name"] }
        ])
      })!
    return response.viewSalesList;
  },
  [
    new EnumFilter('contractTerminated', 'Sales.contractTerminated', () => [{ status: true, name: 'terminated' }, { status: false, name: 'active' }], 'IN', undefined, 'name', 'status'),
  ],
  new KeywordSearch(["Sales.name", "Sales.email"])
))

onMounted(async () => {
  await pagination.loadPage();
})

const toDetail = (salesId: string) => router.push(`/sales/${salesId}`)

const terminateContractConfirmation = (event: Event, salesId: string) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to terminate this sales contract?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const response = await companyUserRepository.getUser()!
        .executeGraphqlMutationInCompany<{ terminateSalesContract: SalesType }>({
          operation: "terminateSalesContract",
          variables: { id: { type: "ID", value: salesId } },
          fields: ['contractTerminated', 'contractTerminatedTime']
        })
      pagination.resultList.find(
        (sales: SalesType) => sales.id === salesId
      )!.contractTerminatedTime = response.terminateSalesContract.contractTerminatedTime
    },
    reject: () => { }
  });
};

</script>

<style lang="scss" scoped></style>