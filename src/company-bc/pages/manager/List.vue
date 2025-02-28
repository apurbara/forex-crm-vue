<template>
  <h1 class="page-title">Manager List</h1>
  <OffsetPaginationComponent :pagination="pagination">
    <template v-slot:editSection>
      <v-btn class="ml-2" prepend-icon="mdi-account-plus-outline" variant="tonal" to="/manager/add">Add
        Manager</v-btn>
    </template>
    <v-table height="400px" density="compact" style="width: 100%;" class="datatable">
      <thead>
        <tr>
          <th>name</th>
          <th>email</th>
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
          @dblclick="toDetail(manager.id!)">
          <td>{{ manager.name }}</td>
          <td>{{ manager.email }}</td>
          <td>
            <v-btn color="green" v-if="!manager.suspended" variant="text" icon="mdi-toggle-switch-outline"
              @click="suspendConfirmation($event, manager.id!)"></v-btn>
            <v-btn color="red" v-else variant="text" icon="mdi-toggle-switch-off-outline"
              @click="unsuspendConfirmation($event, manager.id!)"></v-btn>
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
import { ManagerType } from '@/company-bc/domain/model/manager';

const { companyUserRepository } = useDependencyInjection()
const router = useRouter();
const confirm = useConfirm();

const pagination = reactive(new OffsetPagination<ManagerType>(
  async (pagination) => {
    const response = await companyUserRepository.getUser()!
      .executeGraphqlQueryInCompany<{ viewManagerList: PaginationResponseType<ManagerType> }>({
        operation: 'viewManagerList',
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields([
          'id', 'name', 'email', 'suspended'
        ])
      })!
    return response.viewManagerList;
  },
  [
    new EnumFilter('status', 'Manager.suspended', () => [{ label: 'active', value: false }, { label: 'suspended', value: true }], 'select status ...')
  ],
  new KeywordSearch(["Manager.name", "Manager.email"])
))

onMounted(async () => {
  await pagination.loadPage();
})

const toDetail = (managerId: string) => router.push(`/manager/${managerId}`)

const suspendConfirmation = (event: Event, managerId: string) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to suspend this manager?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const response = await companyUserRepository.getUser()!
        .executeGraphqlMutationInCompany<{ suspendManager: ManagerType }>({
          operation: "suspendManager",
          variables: { id: { type: "ID", value: managerId } },
          fields: ['suspended']
        })
      pagination.resultList.find(
        (manager: ManagerType) => manager.id === managerId
      )!.suspended = response.suspendManager.suspended
    },
    reject: () => { }
  });
};
const unsuspendConfirmation = (event: Event, managerId: string) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to unsuspend this manager?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const response = await companyUserRepository.getUser()!
        .executeGraphqlMutationInCompany<{ unsuspendManager: ManagerType }>({
          operation: "unsuspendManager",
          variables: { id: { type: "ID", value: managerId } },
          fields: ['suspended']
        })
      pagination.resultList.find(
        (manager: ManagerType) => manager.id === managerId
      )!.suspended = response.unsuspendManager.suspended
    },
    reject: () => { }
  });
};

</script>

<style lang="scss" scoped></style>