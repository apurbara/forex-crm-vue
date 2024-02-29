<template>
  <div>
    <h1 class="page-title">Distribute Customer Assignment</h1>
    {{ payload }}
    <OffsetPaginationComponent :pagination="customerPagination">
      <v-table height="400px" density="compact" style="width: 100%;" class="datatable">
        <thead>
          <tr>
            <th><v-checkbox @update:model-value="selectAllCustomer()"></v-checkbox></th>
            <th>name</th>
            <th>email</th>
            <th>phone</th>
            <th>source</th>
            <th>verificationScore</th>
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
            <td><v-checkbox @update:model-value="selectCustomer(customer.id!)" /></td>
            <td>{{ customer.name }}</td>
            <td>{{ customer.email }}</td>
            <td>{{ customer.phone }}</td>
            <td>{{ customer.source }}</td>
            <td>{{ customer.verificationScore }}</td>
            <td>{{ customer.createdTime }}</td>
          </tr>
        </tbody>
      </v-table>
    </OffsetPaginationComponent>

    <OffsetPaginationComponent :pagination="salesPagination">
      <v-table height="400px" density="compact" style="width: 100%;" class="datatable">
        <thead>
          <tr>
            <th><v-checkbox @update:model-value="selectAllSales()" /></th>
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
            <td><v-checkbox @update:model-value="selectSales(sales.id!)" /></td>
            <td>{{ sales.personnel?.name }}</td>
            <td>{{ sales.personnel?.email }}</td>
            <td>{{ sales.type }}</td>
          </tr>
        </tbody>
      </v-table>
    </OffsetPaginationComponent>
    <div class="form">
      <div class="d-flex justify-end">
        <v-btn @click="submit">Submit</v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CustomerType } from '@/domain/model/customer';
import { SalesType } from '@/domain/model/personnel/manager/sales';
import PersonnelRole from '@/domain/user-role/personnel-role';
import ManagerRole from '@/domain/user-role/personnel/manager-role';
import OffsetPaginationComponent from '@/resources/components/OffsetPaginationComponent.vue';
import { KeywordSearch, PaginationResponseType } from '@/resources/components/abstract-pagination';
import OffsetPagination from '@/resources/components/offset-pagination';
import router from '@/router';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted } from 'vue';
import { reactive } from 'vue';

const { httpRequest, userRepository } = useDependencyInjection();

const customerPagination = reactive(new OffsetPagination<CustomerType>(
  async (pagination) => {
    let variables: any = pagination.toGraphqlVariables();
    variables['filters']['value'] = [
      ...variables['filters']['value'],
      { column: "hasActiveAssignment", value: false, comparisonType: 'EQ' }
    ];
    const response = await userRepository.getUser<PersonnelRole>()
      .executeGraphqlQueryInCompany<{ customerList: PaginationResponseType<CustomerType> }>(httpRequest, {
        operation: 'customerList',
        variables: variables,
        fields: OffsetPagination.wrapResultFields([
          'id', 'name', 'email', 'phone', 'source', 'verificationScore', 'createdTime',
        ])
      })!
    return response.customerList;
  },
  [],
  new KeywordSearch(['Customer.name', 'Customer.email', 'Customer.phone'])
))

const salesPagination = reactive(new OffsetPagination<SalesType>(
  async (pagination) => {
    let variables: any = pagination.toGraphqlVariables();
    variables['filters']['value'] = [
      ...variables['filters']['value'],
      { column: "Sales.disabled", value: false, comparisonType: 'EQ' }
    ];
    const response = await userRepository.getUser<ManagerRole>()
      .executeManagerGraphqlQuery<{ salesList: PaginationResponseType<SalesType> }>(httpRequest, {
        operation: 'salesList',
        variables: variables,
        fields: OffsetPagination.wrapResultFields([
          'id', 'type', 'disabled',
          { personnel: ['name', 'email'] }
        ])
      })!
    return response.salesList;
  },
  [],
  new KeywordSearch(['Personnel.name', 'Personnel.email'])
))

onMounted(async () => {
  await customerPagination.loadPage();
  await salesPagination.loadPage();
})

interface Payload {
  customerList: string[],
  salesList: string[],
  selectedCustomerState: {},
}

const payload: Payload = reactive({
  customerList: [],
  salesList: [],
  selectedCustomerState: {},
})

const selectCustomer = (customerId: string): void => {
  if (payload.customerList.includes(customerId)) {
    payload.customerList = payload.customerList.filter(item => item != customerId)
  } else {
    payload.customerList.push(customerId)
  }
}
const selectAllCustomer = (): void => {
  if (payload.customerList.length > 0) {
    payload.customerList.length = 0;
  } else {
    customerPagination.resultList.forEach(customer => {
      payload.customerList.push(customer.id!)
    });
  }
}

const selectSales = (salesId: string) => {
  if (payload.salesList.includes(salesId)) {
    payload.salesList = payload.customerList.filter(item => item != salesId)
  } else {
    payload.salesList.push(salesId)
  }
}
const selectAllSales = () => {
  if (payload.salesList.length > 0) {
    payload.salesList.length = 0;
  } else {
    salesPagination.resultList.forEach(sales => {
      payload.salesList.push(sales.id!)
    });
  }
}

const submit = async () => {
  await userRepository.getUser<ManagerRole>()
    .executeManagerGraphqlMutation(httpRequest, {
      operation: 'assignedMultipleCustomerToMultipleSales',
      variables: {
        customerList: { type: "[ID]", value: payload.customerList },
        salesList: { type: "[ID]", value: payload.salesList },
      },
      fields: [],
    })
  router.push(`/manager-customer-assignment`)
}

</script>

<style scoped></style>