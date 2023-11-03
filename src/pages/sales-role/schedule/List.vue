<template>
  <div>
    <h1 class="page-title">Schedule List</h1>
    <CursorPaginationComponent :pagination="schedulePagination">
      <template v-slot:editSection>
        <v-btn prepend-icon="mdi-account-plus-outline" variant="tonal" to="/schedule/register">Add Schedule</v-btn>
      </template>
      <div height="400px" density="compact" class="card-list">
        <ItemCardComponent class="card-list__item" v-for="(schedule, key) in schedulePagination.resultList" :key="key"
          :item="{ name: schedule.assignedCustomer?.customer?.name }"
          :to="`/assigned-customer/${schedule.assignedCustomer?.id}`">
          <div><v-chip color="success">{{ schedule.status }}</v-chip></div>
          <p>{{ schedule.startTime }} - {{ schedule.endTime }}</p>
          <p>{{ schedule.salesActivity?.name }} - {{ schedule.salesActivity?.duration }}</p>
        </ItemCardComponent>
      </div>
    </CursorPaginationComponent>
  </div>
</template>

<script lang="ts" setup>
import { KeywordSearch, PaginationResponseType } from '@/resources/components/abstract-pagination';
import EnumFilter from '@/resources/components/pagination/enum-filter';
import { reactive } from 'vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import SalesRole from '@/domain/user-role/personnel/sales-role';
import CursorPagination from '@/resources/components/cursor-pagination';
import CursorPaginationComponent from '@/resources/components/CursorPaginationComponent.vue';
import { SalesActivityScheduleType } from '@/domain/model/personnel/manager/sales/assigned-customer/sales-activity-schedule';
import ItemCardComponent from '@/shared/components/item-card-component.vue';

const { httpRequest, userRepository } = useDependencyInjection();
const router = useRouter();

const schedulePagination = reactive(new CursorPagination<SalesActivityScheduleType>(
  async (pagination) => {
    const response = await userRepository.getUser<SalesRole>()
      .executeSalesGraphqlQuery<{ salesActivityScheduleList: PaginationResponseType<SalesActivityScheduleType> }>(httpRequest, {
        operation: "salesActivityScheduleList",
        variables: pagination.toGraphqlVariables(),
        fields: CursorPagination.wrapResultFields([
          "id", "status", "startTime", "endTime",
          { assignedCustomer: ["id", { customer: ["name"] }] },
          { salesActivity: ["name", "duration"] }
        ])
      })
    return response.salesActivityScheduleList;
  },
  [
    new EnumFilter('disabled', 'Schedule.disabled', () => [{ status: true, name: 'disabled' }, { status: false, name: 'active' }], 'IN', undefined, 'name', 'status'),
  ],
  new KeywordSearch(["Schedule.name", "Schedule.email"])
))

onMounted(async () => {
  await schedulePagination.loadPage();
})

</script>

<style lang="scss" scoped></style>