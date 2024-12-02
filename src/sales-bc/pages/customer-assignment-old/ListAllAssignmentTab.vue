<template>
  <ListOffsetTableSection :customer-assignment-pagination="customerAssignmentPagination" />
</template>

<script lang="ts" setup>
import { KeywordSearch, PaginationResponseType } from '@/resources/components/abstract-pagination';
import EnumFilter from '@/resources/components/pagination/enum-filter';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, reactive } from 'vue';
import ListOffsetTableSection from './ListOffsetTableSection.vue';
import OffsetPagination from '@/resources/components/offset-pagination';
import { CustomerAssignmentStatus } from '@/shared-bc/domain/enum/customer-assignment-status';
import { CustomerAssignmentType } from '@/sales-bc/domain/model/sales/customer-assignment';

const { salesRepository } = useDependencyInjection();

const customerAssignmentPagination = reactive(new OffsetPagination<CustomerAssignmentType>(
  async (pagination) => {
    const response = await salesRepository.getUser()
      .executeSalesGraphqlQuery<{ customerAssignmentList: PaginationResponseType<CustomerAssignmentType> }>({
        operation: "customerAssignmentList",
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields(["id", "status", { customer: ["id", "name", "email", "phone", { city: ["name"] }] }])
      })
    return response.customerAssignmentList;
  },
  [
    new EnumFilter('status', 'CustomerAssignment.status', () => Object.keys(CustomerAssignmentStatus).map(key => { return { label: key, value: key } }), 'select status...'),
  ],
  new KeywordSearch(["Customer.name", "Customer.email", "Customer.phone"])
))

onMounted(async () => await customerAssignmentPagination.loadPage())

</script>

<style lang="scss" scoped></style>