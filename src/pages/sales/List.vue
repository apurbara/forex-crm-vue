<template>
  <div>
    <h1 class="page-title">Sales List</h1>
    <OffsetPaginationComponent :pagination="pagination">
      <v-table height="400px" density="compact" style="width: 100%;" class="datatable">
        <thead>
          <tr>
            <th>personnel</th>
            <th>manager</th>
            <th>disabled</th>
            <th>createdTime</th>
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
          <tr v-else v-for="(sales, index) in pagination.resultList" :key="sales.id ?? index" :to="`/Sales/${sales.id}`"
            @dblclick="toDetail(sales.id!)">
            <td>{{ sales.personnel?.name }}</td>
            <td>{{ sales.manager?.personnel?.name }}</td>
            <td>{{ sales.disabled }}</td>
            <td>{{ sales.createdTime }}</td>
            <td><v-btn variant="text" icon="mdi-store-remove-outline" size="x-small"
                @click="disableConfirmation($event)"></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </OffsetPaginationComponent>
  </div>
</template>

<script lang="ts" setup>
import OffsetPaginationComponent from '@/resources/components/OffsetPaginationComponent.vue';
import { KeywordSearch, PaginationResponseType } from '@/resources/components/abstract-pagination';
import OffsetPagination from '@/resources/components/offset-pagination';
import EnumFilter from '@/resources/components/pagination/enum-filter';
import { reactive } from 'vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useConfirm } from "primevue/useconfirm";
import { CompanyUserRoleInterface } from '@/domain/user-role/role-interfaces';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { SalesType } from '@/domain/model/personnel/manager/sales';

const { httpRequest, userRepository } = useDependencyInjection();
const router = useRouter();
const confirm = useConfirm();

const pagination = reactive(new OffsetPagination<SalesType>(
  async (pagination) => {
    const response = await userRepository.getUser<CompanyUserRoleInterface>()
      .executeGraphqlQueryInCompany<{ salesList: PaginationResponseType<SalesType> }>(httpRequest, {
        operation: 'salesList',
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields([
          'id', 'disabled', 'createdTime',
          { personnel: ["name"] },
          { manager: ["id", { personnel: ["name"] }] }
        ])
      })!
    return response.salesList;
  },
  [
    new EnumFilter('disabled', 'Sales.disabled', () => [{ status: true, name: 'disabled' }, { status: false, name: 'active' }], 'IN', undefined, 'name', 'status'),
  ],
  new KeywordSearch(["Personnel.name", "Personnel.email"])
))

onMounted(async () => {
  await pagination.loadPage();
})

const toDetail = (salesId: string) => router.push(`/sales/${salesId}`)

const disableConfirmation = (event: Event) => {
  console.log('confirm disable')
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to disable this item?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: () => {
      // toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
    },
    reject: () => { }
  });
};

</script>

<style lang="scss" scoped></style>