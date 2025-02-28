<template>
  <ListOffsetTableSection :customer-assignment-pagination="greetingAssignmentPagination" />
</template>

<script lang="ts" setup>
import { KeywordSearch, PaginationResponseType } from '@/resources/components/abstract-pagination';
import EnumFilter from '@/resources/components/pagination/enum-filter';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, reactive } from 'vue';
import ListOffsetTableSection from './ListOffsetTableSection.vue';
import OffsetPagination from '@/resources/components/offset-pagination';
import { CustomerAssignmentStatus } from '@/shared-bc/domain/enum/customer-assignment-status';
import { GreetingAssignmentType } from '@/company-bc/domain/model/manager/sales/greeting-assignment';

const { salesRepository } = useDependencyInjection();

const greetingAssignmentPagination = reactive(new OffsetPagination<GreetingAssignmentType>(
  async (pagination) => {
    const response = await salesRepository.getUser()
      .executeSalesGraphqlQuery<{ greetingAssignmentList: PaginationResponseType<GreetingAssignmentType> }>({
        operation: "greetingAssignmentList",
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields(["id", "status", { customer: ["id", "name", "email", "phone", "rating", { city: ["name"] }] }])
      })
    return response.greetingAssignmentList;
  },
  [
    new EnumFilter('status', 'GreetingAssignment.status', () => Object.keys(CustomerAssignmentStatus).map(key => { return { label: key, value: key } }), 'select status...'),
  ],
  new KeywordSearch(["Customer.name", "Customer.email", "Customer.phone"])
))

onMounted(async () => await greetingAssignmentPagination.loadPage())

</script>

<style lang="scss" scoped></style>