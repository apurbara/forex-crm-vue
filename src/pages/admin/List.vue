<template>
  <div>
    <h1 class="page-title">Admin List</h1>
    <OffsetPaginationComponent :pagination="adminPagination">
      <template v-slot:editSection>
        <v-btn prepend-icon="mdi-account-plus-outline" variant="tonal" to="/admin/add">Add Admin</v-btn>
      </template>

      <v-table height="400px" density="compact" style="width: 100%;" class="datatable">
        <thead>
          <tr>
            <th>name</th>
            <th>email</th>
            <th>a super user</th>
            <th>disabled</th>
            <th v-if="user?.hasSuperUserRole()"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="adminPagination.resultList.length < 1">
            <td class="no-data" colspan="12">
              <div class="justify-center text-center pa-5">
                <img src="@/assets/images/image-no-data.svg" alt="No Data" /><br /><br />
                <span class="text-disabled text-body-1">Data Admin kosong</span>
              </div>
            </td>
          </tr>
          <tr v-else v-for="(admin, index) in adminPagination.resultList" :key="admin.id ?? index"
            :to="`/admin/${admin.id}`" @dblclick="toDetail(admin.id)">
            <td>{{ admin.name }}</td>
            <td>{{ admin.email }}</td>
            <td>{{ admin.aSuperUser }}</td>
            <td>{{ admin.disabled }}</td>
            <td v-if="user?.hasSuperUserRole()"><v-btn variant="text" icon="mdi-account-cancel-outline" size="x-small"
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
import { KeywordSearch, PaginationResponseType } from '@/resources/components/abstract-pagination';
import OffsetPagination from '@/resources/components/offset-pagination';
import EnumFilter from '@/resources/components/pagination/enum-filter';
import { reactive } from 'vue';
import { inject } from 'vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useConfirm } from "primevue/useconfirm";

const httpRequest = inject<HttpRequestInterface>('httpRequest')!
const user = inject<UserRepository>('userRepository')?.getInnovUser()
const router = useRouter();
const confirm = useConfirm();

type ResponseType = { id: string; name: string; email: string; disabled: boolean, aSuperUser: boolean }

const adminPagination = reactive(new OffsetPagination<ResponseType>(
  async (pagination) => {
    const response = await user?.executeGraphqlQueryInInnov<{ adminList: PaginationResponseType<ResponseType> }>(httpRequest, {
      operation: 'adminList',
      variables: pagination.toGraphqlVariables(),
      fields: OffsetPagination.wrapResultFields(['id', 'name', 'email', 'disabled', 'aSuperUser'])
    })!
    return response.adminList;
  },
  [
    new EnumFilter('disabled', 'Admin.disabled', () => [{ status: true, name: 'disabled' }, { status: false, name: 'active' }], 'IN', undefined, 'name', 'status'),
    new EnumFilter('a super user', 'Admin.aSuperUser', () => [{ status: true, name: 'SU admin' }, { status: false, name: 'non SU admin' }], 'IN', undefined, 'name', 'status'),
  ],
  new KeywordSearch(["Admin.name", "Admin.email"])
))

onMounted(async () => {
  await adminPagination.loadPage();
})

const toDetail = (adminId: string) => router.push(`/admin/${adminId}`)

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
    reject: () => {}
  });
};

</script>

<style lang="scss" scoped></style>