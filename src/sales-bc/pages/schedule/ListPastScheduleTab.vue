<template>
  <ListOffsetTableSection :activity-schedule-pagination="activitySchedulePagination" />
</template>

<script setup lang="ts">
import ListOffsetTableSection from './ListOffsetTableSection.vue';
import { KeywordSearch, PaginationResponseType } from '@/resources/components/abstract-pagination';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, reactive } from 'vue';
import OffsetPagination from '@/resources/components/offset-pagination';
import { SalesActivityScheduleType } from '@/sales-bc/domain/model/sales/customer-assignment/salesActivitySchedule';
import { SalesActivityScheduleStatus } from '@/shared-bc/domain/enum/sales-activity-schedule-status';

const { httpRequest, salesRepository } = useDependencyInjection();

const activitySchedulePagination = reactive(new OffsetPagination<SalesActivityScheduleType>(
  async (pagination) => {
    const response = await salesRepository.getUser()
      .executeSalesGraphqlQuery<{ salesActivityScheduleList: PaginationResponseType<SalesActivityScheduleType> }>(httpRequest, {
        operation: "salesActivityScheduleList",
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields([
          "id", "status", "startTime", "endTime",
          { customerAssignment: ["id", { customer: ["name"] }, { customerJourney: ["name"] }] }
        ])
      })
    return response.salesActivityScheduleList;
  },
  [],
  new KeywordSearch(["Customer.name", "Customer.email", "Customer.phone"])
))

onMounted(async () => {
  activitySchedulePagination.addHiddenFilter({ column: "SalesActivitySchedule.endTime", value: new Date().toISOString(), comparisonType: 'LTE' });
  activitySchedulePagination.addHiddenFilter({ column: 'SalesActivitySchedule.status', value: SalesActivityScheduleStatus.SCHEDULED });
  await activitySchedulePagination.loadPage();
})

</script>

<style scoped></style>