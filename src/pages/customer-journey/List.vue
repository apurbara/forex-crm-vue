<template>
  <div>
    <h1 class="page-title">Customer Journey List</h1>
    <OffsetPaginationComponent :pagination="pagination">
      <template v-slot:editSection>
          <v-btn prepend-icon="mdi-numeric-1-box-multiple-outline" variant="tonal" to="/customer-journey/set-initial">
            Set Initial Customer Journey</v-btn>
          <v-btn prepend-icon="mdi-store-plus-outline" class="ml-4" variant="tonal" to="/customer-journey/add">
            Add Customer Journey</v-btn>
      </template>
      <v-table height="400px" density="compact" style="width: 100%;" class="datatable">
        <thead>
          <tr>
            <th>name</th>
            <th>description</th>
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
                <span class="text-disabled text-body-1">Data CustomerJourney kosong</span>
              </div>
            </td>
          </tr>
          <tr v-else v-for="(customerJourney, index) in pagination.resultList" :key="customerJourney.id ?? index"
            :to="`/CustomerJourney/${customerJourney.id}`" @dblclick="toDetail(customerJourney.id!)">
            <td>{{ customerJourney.name }}</td>
            <td>{{ customerJourney.description }}</td>
            <td>{{ customerJourney.initial }}</td>
            <td>{{ customerJourney.disabled }}</td>
            <td>{{ customerJourney.createdTime }}</td>
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
import { CustomerJourneyType } from '@/domain/model/customer-journey';

const { httpRequest, userRepository } = useDependencyInjection();
const router = useRouter();
const confirm = useConfirm();

const pagination = reactive(new OffsetPagination<CustomerJourneyType>(
  async (pagination) => {
    const response = await userRepository.getUser<CompanyUserRoleInterface>()
      .executeGraphqlQueryInCompany<{ customerJourneyList: PaginationResponseType<CustomerJourneyType> }>(httpRequest, {
        operation: 'customerJourneyList',
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields(['id', 'name', 'description', 'initial', 'disabled', 'createdTime'])
      })!
    return response.customerJourneyList;
  },
  [
    new EnumFilter('disabled', 'CustomerJourney.disabled', () => [{ status: true, name: 'disabled' }, { status: false, name: 'active' }], 'IN', undefined, 'name', 'status'),
  ],
  new KeywordSearch(["CustomerJourney.name", "CustomerJourney.description"])
))

onMounted(async () => {
  await pagination.loadPage();
})

const toDetail = (customerJourneyId: string) => router.push(`/customer-journey/${customerJourneyId}`)

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