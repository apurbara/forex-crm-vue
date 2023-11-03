<template>
  <div>
    <h1 class="page-title">Manager List</h1>
    <OffsetPaginationComponent :pagination="pagination">
      <v-table height="400px" density="compact" style="width: 100%;" class="datatable">
        <thead>
          <tr>
            <th>personnel</th>
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
                <span class="text-disabled text-body-1">Data Manager kosong</span>
              </div>
            </td>
          </tr>
          <tr v-else v-for="(manager, index) in pagination.resultList" :key="manager.id ?? index"
            :to="`/Manager/${manager.id}`" @dblclick="toDetail(manager.id!)">
            <td>{{ manager.personnel?.name }}</td>
            <td>{{ manager.disabled }}</td>
            <td>{{ manager.createdTime }}</td>
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
import { ManagerType } from '@/domain/model/personnel/manager';

const { httpRequest, userRepository } = useDependencyInjection();
const router = useRouter();
const confirm = useConfirm();

const pagination = reactive(new OffsetPagination<ManagerType>(
  async (pagination) => {
    const response = await userRepository.getUser<CompanyUserRoleInterface>()
      .executeGraphqlQueryInCompany<{ managerList: PaginationResponseType<ManagerType> }>(httpRequest, {
        operation: 'managerList',
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields(['id', 'disabled', 'createdTime', { personnel: ["id", "name"] }])
      })!
    return response.managerList;
  },
  [
    new EnumFilter('disabled', 'Manager.disabled', () => [{ status: true, name: 'disabled' }, { status: false, name: 'active' }], 'IN', undefined, 'name', 'status'),
  ],
  new KeywordSearch(["Personnel.name", "Personnel.email"])
))

onMounted(async () => {
  await pagination.loadPage();
})

const toDetail = (managerId: string) => router.push(`/manager/${managerId}`)

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