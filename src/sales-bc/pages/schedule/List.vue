<template>
  <h1 class="page-title">Schedule List</h1>
  <div class="page-section">
    <v-tabs v-model="tab" fixed-tabs>
      <v-tab value="past-schedule">Past Schedule<v-badge inline rounded="sm" :content="pastScheduleCount"
          color="error" /></v-tab>
      <v-tab value="upcoming-schedule">Upcoming Schedule<v-badge inline rounded="sm" :content="upcomingScheduleCount"
          color="warning" /></v-tab>
      <v-tab value="completed-schedule">Completed Schedule<v-badge inline rounded="sm" :content="completedScheduleCount"
          color="success" /></v-tab>
    </v-tabs>
    <div>
      <v-window v-model="tab">
        <v-window-item value="upcoming-schedule">
          <ListUpcomingScheduleTab />
        </v-window-item>
        <v-window-item value="past-schedule">
          <ListPastScheduleTab />
        </v-window-item>
        <v-window-item value="completed-schedule">
          <ListCompletedScheduleTab />
        </v-window-item>
      </v-window>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SalesActivityScheduleStatus } from '@/shared-bc/domain/enum/sales-activity-schedule-status';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, ref } from 'vue';
import ListUpcomingScheduleTab from './ListUpcomingScheduleTab.vue';
import ListPastScheduleTab from './ListPastScheduleTab.vue';
import ListCompletedScheduleTab from './ListCompletedScheduleTab.vue';
import { useRoute } from 'vue-router';

const { httpRequest, salesRepository } = useDependencyInjection();
const route = useRoute()

const tab = ref<string>();
const upcomingScheduleCount = ref<number>(0)
const pastScheduleCount = ref<number>(0)
const completedScheduleCount = ref<number>(0)

onMounted(async () => {
  tab.value = route.query.tab as string ?? "past-schedule"
  type ResponseType = {
    upcomingScheduleCount: number;
    pastScheduleCount: number;
    completedScheduleCount: number;
  }
  const response = await salesRepository.getUser()
    .executeSalesGraphqlQuery<ResponseType>(httpRequest, [
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
  upcomingScheduleCount.value = response.upcomingScheduleCount;
  pastScheduleCount.value = response.pastScheduleCount;
  completedScheduleCount.value = response.completedScheduleCount;
})
</script>

<style scoped></style>