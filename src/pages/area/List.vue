<template>
  <h1 class="page-title">Area Structure List</h1>
  <OffsetPaginationComponent :pagination="pagination">
    <template v-slot:editSection>
      <!-- <v-btn prepend-icon="mdi-account-plus-outline" variant="tonal" to="/area/add-root">Add Root Area</v-btn> -->
    </template>
    <v-table height="400px" density="compact" style="width: 100%;" class="datatable">
      <thead>
        <tr>
          <th>name</th>
          <th>description</th>
          <th>disabled</th>
          <th>createdTime</th>
          <th>parent</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="pagination.resultList.length < 1">
          <td class="no-data" colspan="12">
            <div class="justify-center text-center pa-5">
              <img src="@/assets/images/image-no-data.svg" alt="No Data" /><br /><br />
              <span class="text-disabled text-body-1">Data Area kosong</span>
            </div>
          </td>
        </tr>
        <tr v-else v-for="(area, index) in pagination.resultList" :key="area.id ?? index" @dblclick="toDetail(area.id!)">
          <td>{{ area.name }}</td>
          <td>{{ area.description }}</td>
          <td>{{ area.disabled }}</td>
          <td>{{ area.createdTime }}</td>
          <td>{{ area.parent?.name }}</td>
          <td>
            <v-btn variant="text" icon="mdi-close-circle-outline" size="x-small"
              @click="disableConfirmation($event)"></v-btn>
            <v-btn variant="text" icon="mdi-source-branch-plus" size="x-small"
              @click="createBranchConfirmation($event, area.id!)"></v-btn>
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
import { reactive } from 'vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useConfirm } from "primevue/useconfirm";
import { CompanyUserRoleInterface } from '@/domain/user-role/role-interfaces';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { AreaType } from '@/domain/model/area-structure/area';

const { httpRequest, userRepository } = useDependencyInjection()
const user = userRepository.getUser<CompanyUserRoleInterface>()
const router = useRouter();
const confirm = useConfirm();

const pagination = reactive(new OffsetPagination<AreaType>(
  async (pagination) => {
    const response = await user?.executeGraphqlQueryInCompany<{ areaList: PaginationResponseType<AreaType> }>(httpRequest, {
      operation: 'areaList',
      variables: pagination.toGraphqlVariables(),
      fields: OffsetPagination.wrapResultFields([
        'id', 'disabled', 'createdTime', 'name', 'description',
        { parent: ["name"] }
      ])
    })!
    return response.areaList;
  },
  [
    new EnumFilter('disabled', 'Area.disabled', () => [{ status: true, name: 'disabled' }, { status: false, name: 'active' }], 'IN', undefined, 'name', 'status'),
  ],
  new KeywordSearch(["Area.name", "Area.description"])
))

onMounted(async () => {
  await pagination.loadPage();
})

const toDetail = (areaId: string) => router.push(`/area/${areaId}`)

const disableConfirmation = (event: Event) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to disable this structure?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: () => {
      // toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
    },
    reject: () => { }
  });
};

const createBranchConfirmation = (event: Event, areaId: string) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'create branch of this area structure?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: () => {
      router.push(`/area/${areaId}/add-branch`)
      // toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
    },
    reject: () => { }
  });
};

</script>

<style lang="scss" scoped></style>