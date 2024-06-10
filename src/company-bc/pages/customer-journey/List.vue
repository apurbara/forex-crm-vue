<template>
  <h1 class="page-title">Customer Journey List</h1>
  <OffsetPaginationComponent :pagination="pagination">
    <template v-slot:editSection>
      <v-btn prepend-icon="mdi-account-plus-outline" variant="tonal" to="/customer-journey/set-initial">Set Initial
        Customer Journey</v-btn>
      <v-btn class="ml-2" prepend-icon="mdi-account-plus-outline" variant="tonal" to="/customer-journey/add">Add
        Customer Journey</v-btn>
    </template>
    <v-table height="400px" density="compact" style="width: 100%;" class="datatable">
      <thead>
        <tr>
          <th>name</th>
          <th>intial</th>
          <th>description</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="pagination.resultList.length < 1">
          <td class="no-data" colspan="12">
            <div class="justify-center text-center pa-5">
              <img src="@/assets/images/image-no-data.svg" alt="No Data" /><br /><br />
              <span class="text-disabled text-body-1">Data Customer Journey kosong</span>
            </div>
          </td>
        </tr>
        <tr v-else v-for="(customerJourney, index) in pagination.resultList" :key="customerJourney.id ?? index"
          @dblclick="toDetail(customerJourney.id!)">
          <td>{{ customerJourney.name }}</td>
          <td><v-btn color="green" v-if="customerJourney.initial" variant="text" icon="mdi-check-circle-outline"
              size="small" /></td>
          <td>{{ customerJourney.description }}</td>
          <td>
            <v-btn color="green" v-if="!customerJourney.disabled" variant="text" icon="mdi-toggle-switch-outline"
              @click="disableConfirmation($event, customerJourney.id!)"></v-btn>
            <v-btn color="red" v-else variant="text" icon="mdi-toggle-switch-off-outline"
              @click="enableConfirmation($event, customerJourney.id!)"></v-btn>
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
import { CustomerJourneyType } from '@/company-bc/domain/model/customer-journey';

const { httpRequest, companyUserRepository } = useDependencyInjection()
const router = useRouter();
const confirm = useConfirm();

const pagination = reactive(new OffsetPagination<CustomerJourneyType>(
  async (pagination) => {
    const response = await companyUserRepository.getUser()
      .executeGraphqlQueryInCompany<{ customerJourneyList: PaginationResponseType<CustomerJourneyType> }>(httpRequest, {
        operation: 'customerJourneyList',
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields([
          'id', 'name', 'initial', 'description', 'disabled'
        ])
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

const toDetail = (customerjourneyId: string) => router.push(`/customer-journey/${customerjourneyId}`)

const disableConfirmation = (event: Event, customerJourneyId: string) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to disable this customer journey?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const response = await companyUserRepository.getUser()
        .executeGraphqlMutationInCompany<{ disableCustomerJourney: CustomerJourneyType }>(httpRequest, {
          operation: "disableCustomerJourney",
          variables: { id: { type: "ID", value: customerJourneyId } },
          fields: ['disabled']
        })
      pagination.resultList.find(
        (customerJourney: CustomerJourneyType) => customerJourney.id === customerJourneyId
      )!.disabled = response.disableCustomerJourney.disabled
    },
    reject: () => { }
  });
};
const enableConfirmation = (event: Event, customerJourneyId: string) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to enable this customer journey?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const response = await companyUserRepository.getUser()
        .executeGraphqlMutationInCompany<{ enableCustomerJourney: CustomerJourneyType }>(httpRequest, {
          operation: "enableCustomerJourney",
          variables: { id: { type: "ID", value: customerJourneyId } },
          fields: ['disabled']
        })
      pagination.resultList.find(
        (customerJourney: CustomerJourneyType) => customerJourney.id === customerJourneyId
      )!.disabled = response.enableCustomerJourney.disabled
    },
    reject: () => { }
  });
};

</script>

<style lang="scss" scoped></style>