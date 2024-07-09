<template>
  <h1 class="page-title">Customer Assignment List</h1>
  <OffsetPaginationComponent :pagination="pagination">
    <template v-slot:editSection>
      <v-btn prepend-icon="mdi-store-plus-outline" class="ml-4" variant="tonal" to="/customer-assignment/distribute">
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
              <span class="text-disabled text-body-1">Data Customer Assignment kosong</span>
            </div>
          </td>
        </tr>
        <tr v-else v-for="(customerAssignment, index) in pagination.resultList" :key="customerAssignment.id ?? index">
          <td>{{ customerAssignment.customer?.name }}</td>
          <td>{{ customerAssignment.sales?.name }}</td>
          <td>{{ customerAssignment.customerJourney?.name }}</td>
          <td>{{ customerAssignment.status }}</td>
          <td>{{ new Date(customerAssignment.createdTime ?? '00-00-00').toLocaleDateString() }}</td>
        </tr>
      </tbody>
    </v-table>
  </OffsetPaginationComponent>
</template>

<script lang="ts" setup>
import OffsetPaginationComponent from '@/resources/components/OffsetPaginationComponent.vue';
import { KeywordSearch, PaginationResponseType } from '@/resources/components/abstract-pagination';
import OffsetPagination from '@/resources/components/offset-pagination';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { CustomerAssignmentType } from '@/company-bc/domain/model/sales/customer-assignment';
import EnumFilter from '@/resources/components/pagination/enum-filter';
import { CustomerAssignmentStatus } from '@/shared-bc/domain/enum/customer-assignment-status';

const { companyUserRepository } = useDependencyInjection()
const router = useRouter();

const pagination = reactive(new OffsetPagination<CustomerAssignmentType>(
  async (pagination) => {
    const response = await companyUserRepository.getUser()!
      .executeGraphqlQueryInCompany<{ customerAssignmentList: PaginationResponseType<CustomerAssignmentType> }>({
        operation: 'customerAssignmentList',
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields([
          'id', 'status', 'createdTime',
          { sales: ['name'] },
          { customer: ['name'] },
          { customerJourney: ['name'] },
        ])
      })!
    return response.customerAssignmentList;
  },
  [
    new EnumFilter('status', 'CustomerAssignment.status', () => Object.keys(CustomerAssignmentStatus).map(key => { return { label: key, value: key } }), 'select status...'),
  ],
  new KeywordSearch(["Customer.name", "Sales.name"])
))

onMounted(async () => {
  await pagination.loadPage();
})

// const toDetail = (customerAssignmentId: string) => router.push(`/customer-assignment/${customerAssignmentId}`)

</script>

<style lang="scss" scoped></style>