<template>
  <ListOffsetTableSection :activity-schedule-pagination="activitySchedulePagination" />
</template>

<script setup lang="ts">
import ListOffsetTableSection from './ListOffsetTableSection.vue';
import { KeywordSearch, PaginationResponseType } from '@/resources/components/abstract-pagination';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, reactive } from 'vue';
import OffsetPagination from '@/resources/components/offset-pagination';
import { SalesActivityScheduleStatus } from '@/shared-bc/domain/enum/sales-activity-schedule-status';
import { SalesActivityScheduleType } from '@/company-bc/domain/model/manager/sales/customer-assignment/sales-activity-schedule';

const { salesRepository } = useDependencyInjection();

const activitySchedulePagination = reactive(new OffsetPagination<SalesActivityScheduleType>(
  async (pagination) => {
    const response = await salesRepository.getUser()
      .executeSalesGraphqlQuery<{ salesActivityScheduleList: PaginationResponseType<SalesActivityScheduleType> }>({
        operation: "salesActivityScheduleList",
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields([
          "id", "status", "startTime", "endTime",
          { strikingAssignment: ["id", { customer: ["name"] }, { customerJourney: ["name"] }] },
          { factFindingAssignment: ["id", { customer: ["name"] }] },
          { greetingAssignment: ["id", { customer: ["name"] }] },
        ])
      })
    return response.salesActivityScheduleList;
  },
  [],
  new KeywordSearch(["Customer.name", "Customer.email", "Customer.phone"])
))

onMounted(async () => {
  activitySchedulePagination.addHiddenFilter({ column: 'SalesActivitySchedule.status', value: SalesActivityScheduleStatus.COMPLETED });
  await activitySchedulePagination.loadPage();
})

</script>

<style scoped></style>