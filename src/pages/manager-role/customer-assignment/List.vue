<template>
  <div>
    <h1 class="page-title">Customer Assignment List</h1>
    <OffsetPaginationComponent :pagination="pagination">
      <template v-slot:editSection>
        <v-btn prepend-icon="mdi-store-plus-outline" class="ml-4" variant="tonal" to="/manager-customer-assignment/distribute">
          Distribute Customer Assignment</v-btn>
      </template>
      <v-table height="400px" density="compact" style="width: 100%;" class="datatable">
        <thead>
          <tr>
            <th>customer</th>
            <th>sales</th>
            <th>customer journey</th>
            <th>status</th>
            <th>createdTime</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="pagination.resultList.length < 1">
            <td class="no-data" colspan="12">
              <div class="justify-center text-center pa-5">
                <img src="@/assets/images/image-no-data.svg" alt="No Data" /><br /><br />
                <span class="text-disabled text-body-1">Data AssignedCustomer kosong</span>
              </div>
            </td>
          </tr>
          <tr v-else v-for="(assignedCustomer, index) in pagination.resultList" :key="assignedCustomer.id ?? index">
            <td>{{ assignedCustomer.customer?.name }}</td>
            <td>{{ assignedCustomer.sales?.personnel?.name }}</td>
            <td>{{ assignedCustomer.customerJourney?.name }}</td>
            <td>{{ assignedCustomer.status }}</td>
            <td>{{ assignedCustomer.createdTime }}</td>
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
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { AssignedCustomerType } from '@/domain/model/personnel/manager/sales/assigned-customer';
import ManagerRole from '@/domain/user-role/personnel/manager-role';

const { httpRequest, userRepository } = useDependencyInjection();

const pagination = reactive(new OffsetPagination<AssignedCustomerType>(
  async (pagination) => {
    const response = await userRepository.getUser<ManagerRole>()
      .executeManagerGraphqlQuery<{ assignedCustomerList: PaginationResponseType<AssignedCustomerType> }>(httpRequest, {
        operation: 'assignedCustomerList',
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields([
          'id', 'status', 'createdTime',
          { sales: [{ personnel: ['name'] }] },
          { customer: ['name'] },
          { customerJourney: ['name'] }
        ])
      })!
    return response.assignedCustomerList;
  },
  [
    new EnumFilter('status', 'AssignedCustomer.status',
      () => [{ status: 'ACTIVE', name: 'ACTIVE' }, { status: 'RECYCLED', name: 'RECYCLED' }, { status: "GOOD_FUND", name: "GOOD_FUND" }],
      'IN', undefined, 'name', 'status'),
  ],
  new KeywordSearch([])
))

onMounted(async () => {
  await pagination.loadPage();
})

</script>

<style lang="scss" scoped></style>