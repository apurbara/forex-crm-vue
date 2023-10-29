<template>
  <div>
    <h1 class="page-title">Sales Activity List</h1>
    <OffsetPaginationComponent :pagination="pagination">
      <template v-slot:editSection>
          <v-btn prepend-icon="mdi-numeric-1-box-multiple-outline" variant="tonal" to="/sales-activity/set-initial">
            Set Initial Sales Activity</v-btn>
          <v-btn prepend-icon="mdi-store-plus-outline" class="ml-4" variant="tonal" to="/sales-activity/add">
            Add Sales Activity</v-btn>
      </template>
      <v-table height="400px" density="compact" style="width: 100%;" class="datatable">
        <thead>
          <tr>
            <th>name</th>
            <th>description</th>
            <th>duration</th>
            <th>initial activity</th>
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
                <span class="text-disabled text-body-1">Data SalesActivity kosong</span>
              </div>
            </td>
          </tr>
          <tr v-else v-for="(salesActivity, index) in pagination.resultList" :key="salesActivity.id ?? index"
            :to="`/SalesActivity/${salesActivity.id}`" @dblclick="toDetail(salesActivity.id!)">
            <td>{{ salesActivity.name }}</td>
            <td>{{ salesActivity.description }}</td>
            <td>{{ salesActivity.duration }}</td>
            <td>{{ salesActivity.initial }}</td>
            <td>{{ salesActivity.disabled }}</td>
            <td>{{ salesActivity.createdTime }}</td>
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
import { KeywordSearch, PaginationResponse } from '@/resources/components/abstract-pagination';
import OffsetPagination from '@/resources/components/offset-pagination';
import EnumFilter from '@/resources/components/pagination/enum-filter';
import { reactive } from 'vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useConfirm } from "primevue/useconfirm";
import { CompanyUserRoleInterface } from '@/domain/user-role/role-interfaces';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { SalesActivityType } from '@/domain/model/sales-activity';

const { httpRequest, userRepository } = useDependencyInjection();
const router = useRouter();
const confirm = useConfirm();

const pagination = reactive(new OffsetPagination<SalesActivityType>(
  async (pagination) => {
    const response = await userRepository.getUser<CompanyUserRoleInterface>()
      .executeGraphqlQueryInCompany<{ salesActivityList: PaginationResponse<SalesActivityType> }>(httpRequest, {
        operation: 'salesActivityList',
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields(['id', 'name', 'description', 'duration', 'initial', 'disabled', 'createdTime'])
      })!
    return response.salesActivityList;
  },
  [
    new EnumFilter('disabled', 'SalesActivity.disabled', () => [{ status: true, name: 'disabled' }, { status: false, name: 'active' }], 'IN', undefined, 'name', 'status'),
  ],
  new KeywordSearch(["SalesActivity.name", "SalesActivity.description"])
))

onMounted(async () => {
  await pagination.loadPage();
})

const toDetail = (salesActivityId: string) => router.push(`/sales-activity/${salesActivityId}`)

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