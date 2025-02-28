<template>
  <h1 class="page-title">Activity List</h1>
  <div class="page-section">
    <v-tabs v-model="tab" fixed-tabs>
      <v-tab value="past-activity">Past Activity<v-badge inline rounded="sm" :content="pastActivityCount"
          color="error" /></v-tab>
      <v-tab value="upcoming-activity">Upcoming Activity<v-badge inline rounded="sm" :content="upcomingActivityCount"
          color="warning" /></v-tab>
      <v-tab value="completed-activity">Completed Activity<v-badge inline rounded="sm" :content="completedActivityCount"
          color="success" /></v-tab>
    </v-tabs>
    <div>
      <v-window v-model="tab">
        <v-window-item value="upcoming-activity">
          <ListUpcomingActivityTab />
        </v-window-item>
        <v-window-item value="past-activity">
          <ListPastActivityTab />
        </v-window-item>
        <v-window-item value="completed-activity">
          <ListCompletedActivityTab />
        </v-window-item>
      </v-window>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SalesActivityScheduleStatus } from '@/shared-bc/domain/enum/sales-activity-schedule-status';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import ListUpcomingActivityTab from './ListUpcomingActivityTab.vue';
import ListPastActivityTab from './ListPastActivityTab.vue';
import ListCompletedActivityTab from './ListCompletedActivityTab.vue';

const { salesRepository } = useDependencyInjection();
const route = useRoute()

const tab = ref<string>();
const upcomingActivityCount = ref<number>(0)
const pastActivityCount = ref<number>(0)
const completedActivityCount = ref<number>(0)

onMounted(async () => {
  tab.value = route.query.tab as string ?? "past-activity"
  type ResponseType = {
    upcomingScheduleCount: number;
    pastScheduleCount: number;
    completedScheduleCount: number;
  }
  const response = await salesRepository.getUser()
    .executeSalesGraphqlQuery<ResponseType>([
      {
        operation: { name: "totalSalesActivitySchedule", alias: "upcomingScheduleCount" },
        variables: {
          upcomingScheduleFilters: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "SalesActivitySchedule.startTime", value: new Date().toISOString(), comparisonType: 'GTE' },
              { column: "SalesActivitySchedule.status", value: SalesActivityScheduleStatus.SCHEDULED },
            ],
          }
        },
        fields: []
      },
      {
        operation: { name: "totalSalesActivitySchedule", alias: "pastScheduleCount" },
        variables: {
          pastScheduleFilters: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "SalesActivitySchedule.endTime", value: new Date().toISOString(), comparisonType: 'LTE' },
              { column: "SalesActivitySchedule.status", value: SalesActivityScheduleStatus.SCHEDULED },
            ],
          }
        },
        fields: []
      },
      {
        operation: { name: "totalSalesActivitySchedule", alias: "completedScheduleCount" },
        variables: {
          completedScheduleFilters: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "SalesActivitySchedule.status", value: SalesActivityScheduleStatus.COMPLETED },
            ],
          }
        },
        fields: []
      },
    ]);
  upcomingActivityCount.value = response.upcomingScheduleCount;
  pastActivityCount.value = response.pastScheduleCount;
  completedActivityCount.value = response.completedScheduleCount;
})
</script>

<style scoped></style>