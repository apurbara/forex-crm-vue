<template>
  <ListOffsetTableSection :customer-assignment-pagination="customerAssignmentPagination" />
</template>

<script lang="ts" setup>
import { KeywordSearch, PaginationResponseType } from '@/resources/components/abstract-pagination';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, reactive } from 'vue';
import ListOffsetTableSection from './ListOffsetTableSection.vue';
import OffsetPagination from '@/resources/components/offset-pagination';
import { CustomerAssignmentStatus } from '@/shared-bc/domain/enum/customer-assignment-status';
import { GreetingAssignmentType } from '@/company-bc/domain/model/manager/sales/greeting-assignment';

const { salesRepository } = useDependencyInjection();

const customerAssignmentPagination = reactive(new OffsetPagination<GreetingAssignmentType>(
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
  'greeting-assignment-idle-page-state'
))

onMounted(async () => {
  customerAssignmentPagination.addHiddenFilter({ column: 'GreetingAssignment.status', value: CustomerAssignmentStatus.ACTIVE });
  customerAssignmentPagination.addHiddenFilter({ column: 'hasSalesActivitySchedule', value: true });
  customerAssignmentPagination.addHiddenFilter({ column: 'hasActiveSalesActivitySchedule', value: false });
  await customerAssignmentPagination.loadPage();
})

</script>

<style lang="scss" scoped></style>