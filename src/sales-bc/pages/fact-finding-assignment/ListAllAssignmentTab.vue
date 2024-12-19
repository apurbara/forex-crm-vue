<template>
  <ListOffsetTableSection :customer-assignment-pagination="FactFindingAssignmentPagination" />
</template>

<script lang="ts" setup>
import { KeywordSearch, PaginationResponseType } from '@/resources/components/abstract-pagination';
import EnumFilter from '@/resources/components/pagination/enum-filter';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, reactive } from 'vue';
import ListOffsetTableSection from './ListOffsetTableSection.vue';
import OffsetPagination from '@/resources/components/offset-pagination';
import { CustomerAssignmentStatus } from '@/shared-bc/domain/enum/customer-assignment-status';
import { FactFindingAssignmentType } from '@/company-bc/domain/model/manager/sales/fact-finding-assignment';

const { salesRepository } = useDependencyInjection();

const FactFindingAssignmentPagination = reactive(new OffsetPagination<FactFindingAssignmentType>(
  async (pagination) => {
    const response = await salesRepository.getUser()
      .executeSalesGraphqlQuery<{ factFindingAssignmentList: PaginationResponseType<FactFindingAssignmentType> }>({
        operation: "factFindingAssignmentList",
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields(["id", "status", { customer: ["id", "name", "email", "phone", "rating", { city: ["name"] }] }])
      })
    return response.factFindingAssignmentList;
  },
  [
    new EnumFilter('status', 'FactFindingAssignment.status', () => Object.keys(CustomerAssignmentStatus).map(key => { return { label: key, value: key } }), 'select status...'),
  ],
  new KeywordSearch(["Customer.name", "Customer.email", "Customer.phone"]),
  undefined,
  'fact-finding-assignment-all-page-state'
))

onMounted(async () => await FactFindingAssignmentPagination.loadPage())

</script>

<style lang="scss" scoped></style>