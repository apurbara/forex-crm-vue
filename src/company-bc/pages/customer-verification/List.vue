<template>
  <h1 class="page-title">Customer Verification List</h1>
  <OffsetPaginationComponent :pagination="pagination">
    <template v-slot:editSection>
      <v-btn class="ml-2" prepend-icon="mdi-account-plus-outline" variant="tonal" to="/customer-verification/add">Add
        Customer Verification</v-btn>
    </template>
    <v-table height="400px" density="compact" style="width: 100%;" class="datatable">
      <thead>
        <tr>
          <th>name</th>
          <th>weight</th>
          <th>position</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="pagination.resultList.length < 1">
          <td class="no-data" colspan="12">
            <div class="justify-center text-center pa-5">
              <img src="@/assets/images/image-no-data.svg" alt="No Data" /><br /><br />
              <span class="text-disabled text-body-1">Data Customer Verification kosong</span>
            </div>
          </td>
        </tr>
        <tr v-else v-for="(customerVerification, index) in pagination.resultList"
          :key="customerVerification.id ?? index" @dblclick="toDetail(customerVerification.id!)">
          <td>{{ customerVerification.name }}</td>
          <td>{{ customerVerification.weight }}</td>
          <td>{{ customerVerification.position }}</td>
          <td>
            <v-btn color="green" v-if="!customerVerification.disabled" variant="text" icon="mdi-toggle-switch-outline"
              @click="disableConfirmation($event, customerVerification.id!)"></v-btn>
            <v-btn color="red" v-else variant="text" icon="mdi-toggle-switch-off-outline"
              @click="enableConfirmation($event, customerVerification.id!)"></v-btn>
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
import { CustomerVerificationType } from '@/company-bc/domain/model/customer-verification';

const { companyUserRepository } = useDependencyInjection()
const router = useRouter();
const confirm = useConfirm();

const pagination = reactive(new OffsetPagination<CustomerVerificationType>(
  async (pagination) => {
    const response = await companyUserRepository.getUser()!
      .executeGraphqlQueryInCompany<{ customerVerificationList: PaginationResponseType<CustomerVerificationType> }>({
        operation: 'customerVerificationList',
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields([
          'id', 'name', 'weight', 'position', 'disabled'
        ])
      })!
    return response.customerVerificationList;
  },
  [
    new EnumFilter('disabled', 'CustomerVerification.disabled', () => [{ status: true, name: 'disabled' }, { status: false, name: 'active' }], 'IN', undefined, 'name', 'status'),
  ],
  new KeywordSearch(["CustomerVerification.name", "CustomerVerification.description"])
))

onMounted(async () => {
  await pagination.loadPage();
})

const toDetail = (customerverificationId: string) => router.push(`/customer-verification/${customerverificationId}`)

const disableConfirmation = (event: Event, customerVerificationId: string) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to disable this customer verification?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const response = await companyUserRepository.getUser()!
        .executeGraphqlMutationInCompany<{ disableCustomerVerification: CustomerVerificationType }>({
          operation: "disableCustomerVerification",
          variables: { id: { type: "ID", value: customerVerificationId } },
          fields: ['disabled']
        })
      pagination.resultList.find(
        (customerVerification: CustomerVerificationType) => customerVerification.id === customerVerificationId
      )!.disabled = response.disableCustomerVerification.disabled
    },
    reject: () => { }
  });
};
const enableConfirmation = (event: Event, customerVerificationId: string) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to enable this customer verification?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const response = await companyUserRepository.getUser()!
        .executeGraphqlMutationInCompany<{ enableCustomerVerification: CustomerVerificationType }>({
          operation: "enableCustomerVerification",
          variables: { id: { type: "ID", value: customerVerificationId } },
          fields: ['disabled']
        })
      pagination.resultList.find(
        (customerVerification: CustomerVerificationType) => customerVerification.id === customerVerificationId
      )!.disabled = response.enableCustomerVerification.disabled
    },
    reject: () => { }
  });
};

</script>

<style lang="scss" scoped></style>