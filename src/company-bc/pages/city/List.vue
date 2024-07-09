<template>
  <h1 class="page-title">City List</h1>
  <OffsetPaginationComponent :pagination="pagination">
    <template v-slot:editSection>
      <v-btn class="ml-2" prepend-icon="mdi-account-plus-outline" variant="tonal" to="/city/add">Add
        City</v-btn>
    </template>
    <v-table height="400px" density="compact" style="width: 100%;" class="datatable">
      <thead>
        <tr>
          <th>name</th>
          <th>province</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="pagination.resultList.length < 1">
          <td class="no-data" colspan="12">
            <div class="justify-center text-center pa-5">
              <img src="@/assets/images/image-no-data.svg" alt="No Data" /><br /><br />
              <span class="text-disabled text-body-1">Data City kosong</span>
            </div>
          </td>
        </tr>
        <tr v-else v-for="(city, index) in pagination.resultList" :key="city.id ?? index"
          @dblclick="toDetail(city.id!)">
          <td>{{ city.name }}</td>
          <td>{{ city.province?.name }}</td>
          <td>
            <v-btn color="green" v-if="!city.disabled" variant="text" icon="mdi-toggle-switch-outline"
              @click="disableConfirmation($event, city.id!)"></v-btn>
            <v-btn color="red" v-else variant="text" icon="mdi-toggle-switch-off-outline"
              @click="enableConfirmation($event, city.id!)"></v-btn>
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
import { CityType } from '@/company-bc/domain/model/province/city';

const { companyUserRepository } = useDependencyInjection()
const router = useRouter();
const confirm = useConfirm();

const pagination = reactive(new OffsetPagination<CityType>(
  async (pagination) => {
    const response = await companyUserRepository.getUser()!
      .executeGraphqlQueryInCompany<{ viewCityList: PaginationResponseType<CityType> }>({
        operation: 'viewCityList',
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields([
          'id', 'name', { province: ["name"] }
        ])
      })!
    return response.viewCityList;
  },
  [
    new EnumFilter('status', 'City.disabled', () => [{ label: 'active', value: false }, { label: 'disabled', value: true }], 'select status ...')
    // new EnumFilter('disabled', 'City.disabled', () => [{ status: true, name: 'disabled' }, { status: false, name: 'active' }], 'IN', undefined, 'name', 'status'),
  ],
  new KeywordSearch(["City.name"])
))

onMounted(async () => {
  await pagination.loadPage();
})

const toDetail = (cityId: string) => router.push(`/city/${cityId}`)

const disableConfirmation = (event: Event, cityId: string) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to disable this city?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const response = await companyUserRepository.getUser()!
        .executeGraphqlMutationInCompany<{ disableCity: CityType }>({
          operation: "disableCity",
          variables: { id: { type: "ID", value: cityId } },
          fields: ['disabled']
        })
      pagination.resultList.find(
        (city: CityType) => city.id === cityId
      )!.disabled = response.disableCity.disabled
    },
    reject: () => { }
  });
};
const enableConfirmation = (event: Event, cityId: string) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to enable this city?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const response = await companyUserRepository.getUser()!
        .executeGraphqlMutationInCompany<{ enableCity: CityType }>({
          operation: "enableCity",
          variables: { id: { type: "ID", value: cityId } },
          fields: ['disabled']
        })
      pagination.resultList.find(
        (city: CityType) => city.id === cityId
      )!.disabled = response.enableCity.disabled
    },
    reject: () => { }
  });
};

</script>

<style lang="scss" scoped></style>