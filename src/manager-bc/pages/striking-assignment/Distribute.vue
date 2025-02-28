<template>
  <div>
    <h1 class="page-title">Distribute Striking Assignment</h1>
    <OffsetPaginationComponent :pagination="customerPagination">
      <template v-slot:editSection>
        <div class="mr-4 font-16 font-medium">Select Customer</div>
      </template>
      <v-table height="300px" density="compact" style="width: 100%;" class="datatable">
        <thead>
          <tr>
            <th>
              <Checkbox v-model="allCustomerSelected" :binary="true" />
            </th>
            <th>name</th>
            <th>email</th>
            <th>phone</th>
            <th>source</th>
            <th>createdTime</th>
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
            <td>
              <Checkbox v-model="payload.customerList" :value="customer.id" />
            </td>
            <td>{{ customer.name }}</td>
            <td>{{ customer.email }}</td>
            <td>{{ customer.phone }}</td>
            <td>{{ customer.source }}</td>
            <td>{{ new Date(customer.createdTime!).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </v-table>
    </OffsetPaginationComponent>

    <OffsetPaginationComponent :pagination="salesPagination">
      <template v-slot:editSection>
        <div class="mr-4 font-16 font-medium">Select Sales</div>
      </template>
      <v-table height="150px" density="compact" style="width: 100%;" class="datatable">
        <thead>
          <tr>
            <th>
              <Checkbox v-model="allSalesSelected" :binary="true" />
            </th>
            <th>name</th>
            <th>email</th>
            <th>type</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="salesPagination.resultList.length < 1">
            <td class="no-data" colspan="12">
              <div class="justify-center text-center pa-5">
                <img src="@/assets/images/image-no-data.svg" alt="No Data" /><br /><br />
                <span class="text-disabled text-body-1">Data Sales kosong</span>
              </div>
            </td>
          </tr>
          <tr v-else v-for="(sales, index) in salesPagination.resultList" :key="sales.id ?? index">
            <td>
              <Checkbox v-model="payload.salesList" :value="sales.id" />
            </td>
            <td>{{ sales.name }}</td>
            <td>{{ sales.email }}</td>
            <td>{{ sales.role }}</td>
          </tr>
        </tbody>
      </v-table>
    </OffsetPaginationComponent>
    <div class="form">
      <div class="d-flex justify-end align-center">
        <div class="mx-4">
          <v-select density="compact" hide-details :items="Object.keys(DistributionStrategy)"
            v-model="payload.distributionStrategy" label="distribution strategy"></v-select>
        </div>
        <v-btn :disabled="!isValidToSubmit" @click="submit">Submit</v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CustomerType } from '@/company-bc/domain/model/customer';
import OffsetPaginationComponent from '@/resources/components/OffsetPaginationComponent.vue';
import { KeywordSearch, PaginationResponseType } from '@/resources/components/abstract-pagination';
import OffsetPagination, { OffsetLimit } from '@/resources/components/offset-pagination';
import router from '@/router';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { computed, onMounted, ref, watch } from 'vue';
import { reactive } from 'vue';
import Checkbox from 'primevue/checkbox';
import { SalesType } from '@/company-bc/domain/model/manager/sales';
import { CustomerStatusEnum } from '@/shared-bc/domain/enum/customer-status-enum';
import { SalesRoleEnum } from '@/shared-bc/domain/enum/sales-role-enum';

const { companyUserRepository, managerRepository } = useDependencyInjection();

const customerPagination = reactive(new OffsetPagination<CustomerType>(
  async (pagination) => {
    const response = await companyUserRepository.getUser()!
      .executeGraphqlQueryInCompany<{ customerList: PaginationResponseType<CustomerType> }>({
        operation: 'customerList',
        variables: pagination.toGraphqlVariables(),
        // variables: variables,
        fields: OffsetPagination.wrapResultFields([
          'id', 'name', 'email', 'phone', 'source', 'verificationScore', 'createdTime',
        ])
      })!
    return response.customerList;
  },
  [],
  new KeywordSearch(['Customer.name', 'Customer.email', 'Customer.phone']),
  new OffsetLimit(100)
)
  .addHiddenFilter({ column: "hasActiveStrikingAssignment", value: false, comparisonType: 'EQ' })
  .addHiddenFilter({ column: "Customer.status", value: CustomerStatusEnum.STRIKING_REQUIRED, comparisonType: 'EQ' })
)

const salesPagination = reactive(new OffsetPagination<SalesType>(
  async (pagination) => {
    const response = await managerRepository.getUser()!
      .executeManagerGraphqlQuery<{ viewSalesList: PaginationResponseType<SalesType> }>({
        operation: 'viewSalesList',
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields([
          'id', 'role', 'name', 'email',
        ])
      })!
    return response.viewSalesList;
  },
  [],
  new KeywordSearch(['Sales.name', 'Sales.email'])
)
  .addHiddenFilter({ column: "Sales.contractTerminated", value: false, comparisonType: 'EQ' })
  .addHiddenFilter({ column: "Sales.role", value: SalesRoleEnum.STRIKER, comparisonType: 'EQ' })
)

onMounted(async () => {
  await customerPagination.loadPage();
  await salesPagination.loadPage();
})


enum DistributionStrategy {
  LOAD_BALANCE_DISTRIBUTION = 'LOAD_BALANCE_DISTRIBUTION',
  EVEN_DISTRIBUTION = 'EVEN_DISTRIBUTION',
}

interface Payload {
  customerList: string[],
  salesList: string[],
  distributionStrategy: DistributionStrategy,
}

const payload: Payload = reactive({
  customerList: [],
  salesList: [],
  distributionStrategy: DistributionStrategy.EVEN_DISTRIBUTION,
})

const allCustomerSelected = ref(false);
const allSalesSelected = ref(false);

watch(allCustomerSelected, (selectAllCustomer) => {
  payload.customerList.length = 0
  if (selectAllCustomer) {
    customerPagination.resultList.forEach(customer => {
      payload.customerList.push(customer.id!)
    });
  }
})

watch(allSalesSelected, (selectAllSales) => {
  payload.salesList.length = 0
  if (selectAllSales) {
    salesPagination.resultList.forEach(sales => {
      payload.salesList.push(sales.id!)
    });
  }
})

const isValidToSubmit = computed(() => payload.customerList.length > 0 && payload.salesList.length > 0)
const submit = async () => {
  await managerRepository.getUser()!
    .executeManagerGraphqlMutation({
      operation: 'assignStrikingActivityOfCustomerListToSales',
      variables: {
        customerList: { type: "[ID]", value: payload.customerList },
        salesList: { type: "[ID]", value: payload.salesList },
        distributionStrategy: payload.distributionStrategy,
      },
      fields: [],
    })
  router.push(`/manager-fact-finding-assignment`)
}

</script>

<style scoped></style>