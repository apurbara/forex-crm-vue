<template>
  <ListOffsetTableSection :customer-assignment-pagination="customerAssignmentPagination" />
</template>

<script lang="ts" setup>
import { KeywordSearch, PaginationResponseType } from '@/resources/components/abstract-pagination';
import CursorPagination from '@/resources/components/cursor-pagination';
import EnumFilter from '@/resources/components/pagination/enum-filter';
import { CustomerAssignmentType } from '@/sales-bc/domain-old/model/sales/customer-assignment';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, reactive } from 'vue';
import ListOffsetTableSection from './ListOffsetTableSection.vue';
import OffsetPagination from '@/resources/components/offset-pagination';
import { CustomerAssignmentStatus } from '@/shared-bc/domain/enum/customer-assignment-status';

const { httpRequest, salesRepository } = useDependencyInjection();

const customerAssignmentPagination = reactive(new OffsetPagination<CustomerAssignmentType>(
  async (pagination) => {
    const response = await salesRepository.getUser()
      .executeSalesGraphqlQuery<{ customerAssignmentList: PaginationResponseType<CustomerAssignmentType> }>(httpRequest, {
        operation: "customerAssignmentList",
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields(["id", "status", { customer: ["id", "name", "email", "phone", { area: ["name"] }] }])
      })
    return response.customerAssignmentList;
  },
  [
    new EnumFilter('status', 'CustomerAssignment.status', () => Object.keys(CustomerAssignmentStatus).map(key => { return { name: key, value: key } }), 'IN', 'name', 'value'),
  ],
  new KeywordSearch(["Customer.name", "Customer.email", "Customer.phone"])
))

onMounted(async () => await customerAssignmentPagination.loadPage())

</script>

<style lang="scss" scoped></style>