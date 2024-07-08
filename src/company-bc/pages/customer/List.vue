<template>
  <h1 class="page-title">Customer List</h1>
  <OffsetPaginationComponent :pagination="pagination">
    <template v-slot:editSection>
      <v-btn prepend-icon="mdi-account-plus-outline" variant="tonal" :loading="isSelecting"
        @click="handleFileImport">import from csv</v-btn>
      <input type="file" accept=".csv" ref="uploader" class="d-none" @change="onFileChange">
    </template>
    <v-table height="400px" density="compact" style="width: 100%;" class="datatable">
      <thead>
        <tr>
          <th>name</th>
          <th>email</th>
          <th>phone</th>
          <th>verification score</th>
          <th>source</th>
          <th>created time</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="pagination.resultList.length < 1">
          <td class="no-data" colspan="12">
            <div class="justify-center text-center pa-5">
              <img src="@/assets/images/image-no-data.svg" alt="No Data" /><br /><br />
              <span class="text-disabled text-body-1">Data Customer kosong</span>
            </div>
          </td>
        </tr>
        <tr v-else v-for="(customer, index) in pagination.resultList" :key="customer.id ?? index">
          <td>{{ customer.name }}</td>
          <td>{{ customer.email }}</td>
          <td>{{ customer.phone }}</td>
          <td>{{ customer.verificationScore }}</td>
          <td>{{ customer.source }}</td>
          <td>{{ new Date(customer.createdTime!).toLocaleDateString() }}</td>
        </tr>
      </tbody>
    </v-table>
    <template v-slot:navigation>
      <v-btn prepend-icon="mdi-account-plus-outline" variant="tonal" @click="exportCustomer">export to scv</v-btn>
    </template>
  </OffsetPaginationComponent>
</template>

<script lang="ts" setup>
import OffsetPaginationComponent from '@/resources/components/OffsetPaginationComponent.vue';
import { KeywordSearch, PaginationResponseType } from '@/resources/components/abstract-pagination';
import OffsetPagination, { OffsetLimit } from '@/resources/components/offset-pagination';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { CustomerType } from '@/company-bc/domain/model/customer';
import ManagerRole from '@/company-bc/role/manager-role';
import { AxiosProgressEvent } from 'axios';

const { httpRequest, restRequest, companyUserRepository } = useDependencyInjection()
const router = useRouter();

const pagination = reactive(new OffsetPagination<CustomerType>(
  async (pagination) => {
    const response = await companyUserRepository.getUser()
      .executeGraphqlQueryInCompany<{ customerList: PaginationResponseType<CustomerType> }>(httpRequest, {
        operation: 'customerList',
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields([
          'id', 'disabled', 'createdTime', 'name', 'email', 'phone', 'source', 'verificationScore'
        ])
      })!
    return response.customerList;
  },
  [],
  new KeywordSearch(["Customer.name", "Customer.email", "Customer.phone"])
))

onMounted(async () => {
  await pagination.loadPage();
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
  const failedList = await companyUserRepository.getUser<ManagerRole>()
    .uploadFile(restRequest, '/import-customer-from-csv', file, (event: AxiosProgressEvent) => { progress.value = Math.round((100 * event.loaded) / event.total!) })
  console.log(failedList);
  await pagination.loadPage();
}

const exportCustomer = async () => {
  const params = pagination.toQueryParams();
  await companyUserRepository.getUser<ManagerRole>()
    .downloadStream(restRequest, "/export-customer-to-csv", params, 'text/csv', 'customer');
}

</script>

<style lang="scss" scoped></style>