<template>
  <div>
    <h1 class="page-title">Customer Verification List</h1>
    <OffsetPaginationComponent :pagination="pagination">
      <template v-slot:editSection>
        <v-btn prepend-icon="mdi-account-plus-outline" variant="tonal" to="/customer-verification/add">
          Add Customer Verification</v-btn>
      </template>
      <v-table height="400px" density="compact" style="width: 100%;" class="datatable">
        <thead>
          <tr>
            <th>name</th>
            <th>description</th>
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
                <span class="text-disabled text-body-1">Data CustomerVerification kosong</span>
              </div>
            </td>
          </tr>
          <tr v-else v-for="(customerVerification, index) in pagination.resultList"
            :key="customerVerification.id ?? index" :to="`/CustomerVerification/${customerVerification.id}`"
            @dblclick="toDetail(customerVerification.id!)">
            <td>{{ customerVerification.name }}</td>
            <td>{{ customerVerification.description }}</td>
            <td>{{ customerVerification.disabled }}</td>
            <td>{{ customerVerification.createdTime }}</td>
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
import { KeywordSearch, PaginationResponse } from '@/resources/components/abstract-pagination';
import OffsetPagination from '@/resources/components/offset-pagination';
import EnumFilter from '@/resources/components/pagination/enum-filter';
import { reactive } from 'vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useConfirm } from "primevue/useconfirm";
import { CompanyUserRoleInterface } from '@/domain/user-role/role-interfaces';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { CustomerVerificationType } from '@/domain/model/customer-verification';

const { httpRequest, userRepository } = useDependencyInjection();
const router = useRouter();
const confirm = useConfirm();

const pagination = reactive(new OffsetPagination<CustomerVerificationType>(
  async (pagination) => {
    const response = await userRepository.getUser<CompanyUserRoleInterface>()
      .executeGraphqlQueryInCompany<{ customerVerificationList: PaginationResponse<CustomerVerificationType> }>(httpRequest, {
        operation: 'customerVerificationList',
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields(['id', 'name', 'description', 'disabled', 'createdTime'])
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

const toDetail = (customerVerificationId: string) => router.push(`/customer-verification/${customerVerificationId}`)

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