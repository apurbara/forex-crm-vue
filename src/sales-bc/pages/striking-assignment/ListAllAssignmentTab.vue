<template>
  <ListOffsetTableSection :customer-assignment-pagination="strikingAssignmentPagination" />
</template>

<script lang="ts" setup>
import { KeywordSearch, PaginationResponseType } from '@/resources/components/abstract-pagination';
import EnumFilter from '@/resources/components/pagination/enum-filter';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, reactive } from 'vue';
import ListOffsetTableSection from './ListOffsetTableSection.vue';
import OffsetPagination from '@/resources/components/offset-pagination';
import { CustomerAssignmentStatus } from '@/shared-bc/domain/enum/customer-assignment-status';
import { StrikingAssignmentType } from '@/company-bc/domain/model/manager/sales/striking-assignment';

const { salesRepository } = useDependencyInjection();

const strikingAssignmentPagination = reactive(new OffsetPagination<StrikingAssignmentType>(
  async (pagination) => {
    const response = await salesRepository.getUser()
      .executeSalesGraphqlQuery<{ strikingAssignmentList: PaginationResponseType<StrikingAssignmentType> }>({
        operation: "strikingAssignmentList",
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields(["id", "status", { customer: ["id", "name", "email", "phone", "rating", { city: ["name"] }] }])
      })
    return response.strikingAssignmentList;
  },
  [
    new EnumFilter('status', 'StrikingAssignment.status', () => Object.keys(CustomerAssignmentStatus).map(key => { return { label: key, value: key } }), 'select status...'),
  ],
  new KeywordSearch(["Customer.name", "Customer.email", "Customer.phone"]),
  undefined,
  'striking-assignment-all-page-state'
))

onMounted(async () => await strikingAssignmentPagination.loadPage())

</script>

<style lang="scss" scoped></style>