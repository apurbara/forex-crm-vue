<template>
  <ListOffsetPaginationTableSection :customer-assignment-pagination="customerAssignmentPagination" />
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import ListOffsetPaginationTableSection from './ListOffsetPaginationTableSection.vue';
import OffsetPagination from '@/resources/components/offset-pagination';
import { KeywordSearch, PaginationResponseType } from '@/resources/components/abstract-pagination';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { CustomerAssignmentStatus } from '@/shared-bc/domain/enum/customer-assignment-status';
import { useSalesStore } from '@/store/sales';
import EnumFilter from '@/resources/components/pagination/enum-filter';
import { useCustomerJourneyStore } from '@/store/customer-journey';
import { CustomerAssignmentType } from '@/manager-bc/domain/model/manager/sales/customer-assignment';

const { managerRepository } = useDependencyInjection();
const salesStore = useSalesStore();
const customerJourneyStore = useCustomerJourneyStore();

const customerAssignmentPagination = reactive(new OffsetPagination<CustomerAssignmentType>(
  async (pagination) => {
    const response = await managerRepository.getUser()
      .executeManagerGraphqlQuery<{ customerAssignmentList: PaginationResponseType<CustomerAssignmentType> }>({
        operation: "customerAssignmentList",
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields([
          "id", "status", "createdTime",
          { customer: ["id", "name", "email", "phone", { city: ["name"] }] },
          { sales: ["id", "name", "email"] },
          { customerJourney: ["name"] },
        ])
      })
    return response.customerAssignmentList;
  },
  [
    new EnumFilter('Sales', 'Sales.id', async () => {
      const salesList = await salesStore.getAllActiveInHouseSalesListBelongsToManager
      return salesList.value.map((salesData) => { return { value: salesData.id, label: salesData.name } })
    }, 'search sales...'),
    new EnumFilter('Customer Journey', 'CustomerJourney.id', async () => {
      const customerJourneyList = await customerJourneyStore.getAllActiveCustomerJourneyList
      return customerJourneyList.value.map((customerJourneyData) => { return { value: customerJourneyData.id!, label: customerJourneyData.name! } })
    }, 'search journey...'),
    new EnumFilter('status', 'CustomerAssignment.status', () => Object.keys(CustomerAssignmentStatus).map(key => { return { label: key, value: key } }), 'select status...'),
  ],
  new KeywordSearch(["Customer.name"], "LIKE", "search customer name ...")
))

onMounted(async () => {
  customerAssignmentPagination.addHiddenFilter({ column: 'CustomerAssignment.status', value: CustomerAssignmentStatus.ACTIVE });
  await customerAssignmentPagination.loadPage();
})


</script>

<style scoped></style>