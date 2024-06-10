<template>
  <h1 class="page-title">Schedule List</h1>
  <div>
    <v-tabs v-model="tab" fixed-tabs bg-color="primary">
      <v-tab value="upcomingSchedule">Upcoming Schedule<v-badge inline :content="upcomingScheduleCount"
          color="green" /></v-tab>
      <v-tab value="pastSchedule">Past Schedule<v-badge inline :content="pastScheduleCount" color="warning" /></v-tab>
      <v-tab value="completedSchedule">Completed Schedule<v-badge inline :content="completedScheduleCount"
          color="grey" /></v-tab>
    </v-tabs>
    <div>
      <v-window v-model="tab">
        <v-window-item value="upcomingSchedule">
          <ListUpcomingScheduleTab />
        </v-window-item>
        <v-window-item value="pastSchedule">
          <ListPastScheduleTab />
        </v-window-item>
        <v-window-item value="completedSchedule">
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
  tab.value = route.query.tab as string ?? "upcomingSchedule"
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