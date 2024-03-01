<template>
  <div>
    <h1 class="page-title">Customer List</h1>
    <OffsetPaginationComponent :pagination="customerPagination">
      <template v-slot:editSection>
        <v-btn prepend-icon="mdi-account-plus-outline" variant="tonal" :loading="isSelecting"
          @click="handleFileImport">import from csv</v-btn>
        <input type="file" accept=".csv" ref="uploader" class="d-none" @change="onFileChange">
      </template>
      <v-table height="400px" density="compact" style="width: 100%;" class="datatable">
        <thead>
          <tr>
            <th>name</th>
            <th>phone</th>
            <th>email</th>
            <th>source</th>
            <th>verificationScore</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="customerPagination.resultList.length < 1">
            <td class="no-data" colspan="12">
              <div class="justify-center text-center pa-5">
                <img src="@/assets/images/image-no-data.svg" alt="No Data" /><br /><br />
                <span class="text-disabled text-body-1">Data Customer kosong</span>
              </div>
            </td>
          </tr>
          <tr v-else v-for="(customer, index) in customerPagination.resultList" :key="customer.id ?? index">
            <td>{{ customer.name }}</td>
            <td>{{ customer.phone }}</td>
            <td>{{ customer.email }}</td>
            <td>{{ customer.source }}</td>
            <td>{{ customer.verificationScore }}</td>
          </tr>
        </tbody>
      </v-table>
      <template v-slot:navigation>
        <v-btn prepend-icon="mdi-account-plus-outline" variant="tonal" @click="exportCustomer">export to scv</v-btn>
      </template>
    </OffsetPaginationComponent>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { inject } from 'vue';
import { onMounted } from 'vue';
import HttpRequestInterface from '@/domain/user-role/http-request-interface';
import UserRepository from '@/domain/user-repository';
import OffsetPagination from '@/resources/components/offset-pagination';
import { CompanyUserRoleInterface } from '@/domain/user-role/role-interfaces';
import { KeywordSearch, PaginationResponseType } from '@/resources/components/abstract-pagination';
import { CustomerType } from '@/domain/model/customer';
import OffsetPaginationComponent from '@/resources/components/OffsetPaginationComponent.vue';
import { ref } from 'vue';
import { AxiosProgressEvent } from 'axios';
import RestRequestInterface from '@/domain/user-role/rest-request-interface';
import ManagerRole from '@/domain/user-role/personnel/manager-role';

const httpRequest = inject<HttpRequestInterface>('httpRequest')!
const restRequest = inject<RestRequestInterface>('restRequest')!
const userRepository = inject<UserRepository>('userRepository');
// const user = inject<UserRepository>('userRepository')?.getUser<CompanyUserRoleInterface>()
// const manager = inject<UserRepository>('userRepository')?.getUser<ManagerRole>()

const customerPagination = reactive(new OffsetPagination<CustomerType>(
  async (pagination) => {
    const response = await userRepository?.getUser<CompanyUserRoleInterface>()
      .executeGraphqlQueryInCompany<{ customerList: PaginationResponseType<CustomerType> }>(httpRequest, {
        operation: 'customerList',
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields(['id', 'name', 'phone', 'email', 'source', 'verificationScore'])
      })!
    return response.customerList;
  },
  [],
  new KeywordSearch(["Customer.name", "Customer.email", "Customer.phone", "Customer.source"])
))

onMounted(async () => {
  await customerPagination.loadPage();
})

const isSelecting = ref<boolean>(false)
const progress = ref<number>(0)
const uploader = ref<HTMLInputElement | null>(null)

const handleFileImport = async () => {
  isSelecting.value = true
  window.addEventListener('focus', () => {
    isSelecting.value = false
  }, { once: true })
  uploader.value!.click()
}

const onFileChange = async (e: any) => {
  const file = e.target.files[0]
  const failedList = await userRepository?.getUser<ManagerRole>()
    .uploadFile(restRequest, '/import-customer-from-csv', file, (event: AxiosProgressEvent) => { progress.value = Math.round((100 * event.loaded) / event.total!) })
  console.log(failedList);
  await customerPagination.loadPage();
}

const exportCustomer = async () => {
  const params = customerPagination.toQueryParams();
  await userRepository?.getUser<ManagerRole>()
    .downloadStream(restRequest, "/export-customer-to-csv", params, 'text/csv', 'customer');
}

</script>

<style lang="scss" scoped></style>