<template>
  <ListOffsetTableSection :customer-assignment-pagination="greetingAssignmentPagination" />
</template>

<script lang="ts" setup>
import { KeywordSearch, PaginationResponseType } from '@/resources/components/abstract-pagination';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, reactive } from 'vue';
import ListOffsetTableSection from './ListOffsetTableSection.vue';
import OffsetPagination from '@/resources/components/offset-pagination';
import { GreetingAssignmentType } from '@/company-bc/domain/model/manager/sales/greeting-assignment';
import { CustomerAssignmentStatus } from '@/shared-bc/domain/enum/customer-assignment-status';

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
  [],
  new KeywordSearch(["Customer.name", "Customer.email", "Customer.phone"]),
  undefined,
  'greeting-assignment-active-page-state',
))

onMounted(async () => {
  greetingAssignmentPagination.addHiddenFilter({ column: 'GreetingAssignment.status', value: CustomerAssignmentStatus.ACTIVE });
  await greetingAssignmentPagination.loadPage();
})

</script>

<style lang="scss" scoped></style>