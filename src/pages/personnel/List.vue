<template>
  <div>
    <h1 class="page-title">Personnel List</h1>
    <OffsetPaginationComponent :pagination="personnelPagination">
      <template v-slot:editSection>
        <v-btn prepend-icon="mdi-account-plus-outline" variant="tonal" to="/personnel/add">Add Personnel</v-btn>
      </template>
      <v-table height="400px" density="compact" style="width: 100%;" class="datatable">
        <thead>
          <tr>
            <th>name</th>
            <th>email</th>
            <th>disabled</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="personnelPagination.resultList.length < 1">
            <td class="no-data" colspan="12">
              <div class="justify-center text-center pa-5">
                <img src="@/assets/images/image-no-data.svg" alt="No Data" /><br /><br />
                <span class="text-disabled text-body-1">Data Personnel kosong</span>
              </div>
            </td>
          </tr>
          <tr v-else v-for="(personnel, index) in personnelPagination.resultList" :key="personnel.id ?? index"
            :to="`/Personnel/${personnel.id}`" @dblclick="toDetail(personnel.id)">
            <td>{{ personnel.name }}</td>
            <td>{{ personnel.email }}</td>
            <td>{{ personnel.disabled }}</td>
            <td><v-btn variant="text" icon="mdi-account-cancel-outline" size="x-small"
                @click="disableConfirmation($event)"></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </OffsetPaginationComponent>
  </div>
</template>

<script lang="ts" setup>
import UserRepository from '@/domain/user-repository';
import HttpRequestInterface from '@/domain/user-role/http-request-interface';
import OffsetPaginationComponent from '@/resources/components/OffsetPaginationComponent.vue';
import { KeywordSearch, PaginationResponse } from '@/resources/components/abstract-pagination';
import OffsetPagination from '@/resources/components/offset-pagination';
import EnumFilter from '@/resources/components/pagination/enum-filter';
import { reactive } from 'vue';
import { inject } from 'vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useConfirm } from "primevue/useconfirm";
import { CompanyUserRoleInterface } from '@/domain/user-role/role-interfaces';

const httpRequest = inject<HttpRequestInterface>('httpRequest')!
const user = inject<UserRepository>('userRepository')?.getUser<CompanyUserRoleInterface>()
const router = useRouter();
const confirm = useConfirm();

type ResponseType = { id: string; name: string; email: string; disabled: boolean, aSuperUser: boolean }

const personnelPagination = reactive(new OffsetPagination<ResponseType>(
  async (pagination) => {
    const response = await user?.executeGraphqlQueryInCompany<{ personnelList: PaginationResponse<ResponseType> }>(httpRequest, {
      operation: 'personnelList',
      variables: pagination.toGraphqlVariables(),
      fields: OffsetPagination.wrapResultFields(['id', 'name', 'email', 'disabled'])
    })!
    return response.personnelList;
  },
  [
    new EnumFilter('disabled', 'Personnel.disabled', () => [{ status: true, name: 'disabled' }, { status: false, name: 'active' }], 'IN', undefined, 'name', 'status'),
  ],
  new KeywordSearch(["Personnel.name", "Personnel.email"])
))

onMounted(async () => {
  await personnelPagination.loadPage();
})

const toDetail = (personnelId: string) => router.push(`/personnel/${personnelId}`)

const disableConfirmation = (event: Event) => {
  console.log('confirm disable')
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to disable this user?',
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