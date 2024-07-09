<template>
  <h1 class="page-title">Province List</h1>
  <OffsetPaginationComponent :pagination="pagination">
    <template v-slot:editSection>
      <v-btn class="ml-2" prepend-icon="mdi-account-plus-outline" variant="tonal" to="/province/add">Add
        Province</v-btn>
    </template>
    <v-table height="400px" density="compact" style="width: 100%;" class="datatable">
      <thead>
        <tr>
          <th>name</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="pagination.resultList.length < 1">
          <td class="no-data" colspan="12">
            <div class="justify-center text-center pa-5">
              <img src="@/assets/images/image-no-data.svg" alt="No Data" /><br /><br />
              <span class="text-disabled text-body-1">Data Province kosong</span>
            </div>
          </td>
        </tr>
        <tr v-else v-for="(province, index) in pagination.resultList" :key="province.id ?? index">
          <td>{{ province.name }}</td>
          <td>
            <v-btn color="green" v-if="!province.disabled" variant="text" icon="mdi-toggle-switch-outline"
              @click="disableConfirmation($event, province.id!)"></v-btn>
            <v-btn color="red" v-else variant="text" icon="mdi-toggle-switch-off-outline"
              @click="enableConfirmation($event, province.id!)"></v-btn>
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
import { ProvinceType } from '@/company-bc/domain/model/province';

const { companyUserRepository } = useDependencyInjection()
const router = useRouter();
const confirm = useConfirm();

const pagination = reactive(new OffsetPagination<ProvinceType>(
  async (pagination) => {
    const response = await companyUserRepository.getUser()!
      .executeGraphqlQueryInCompany<{ viewProvinceList: PaginationResponseType<ProvinceType> }>({
        operation: 'viewProvinceList',
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields([
          'id', 'name', 'disabled'
        ])
      })!
    return response.viewProvinceList;
  },
  [
    new EnumFilter('status', 'Province.disabled', () => [{ label: 'active', value: false }, { label: 'disabled', value: true }], 'select status ...')
  ],
  new KeywordSearch(["Province.name"])
))

onMounted(async () => {
  await pagination.loadPage();
})

const disableConfirmation = (event: Event, provinceId: string) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to disable this province?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const response = await companyUserRepository.getUser()!
        .executeGraphqlMutationInCompany<{ disableProvince: ProvinceType }>({
          operation: "disableProvince",
          variables: { id: { type: "ID", value: provinceId } },
          fields: ['disabled']
        })
      pagination.resultList.find(
        (province: ProvinceType) => province.id === provinceId
      )!.disabled = response.disableProvince.disabled
    },
    reject: () => { }
  });
};
const enableConfirmation = (event: Event, provinceId: string) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to enable this province?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const response = await companyUserRepository.getUser()!
        .executeGraphqlMutationInCompany<{ enableProvince: ProvinceType }>({
          operation: "enableProvince",
          variables: { id: { type: "ID", value: provinceId } },
          fields: ['disabled']
        })
      pagination.resultList.find(
        (province: ProvinceType) => province.id === provinceId
      )!.disabled = response.enableProvince.disabled
    },
    reject: () => { }
  });
};

</script>

<style lang="scss" scoped></style>