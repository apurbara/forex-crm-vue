<template>
  <!-- <h1 class="page-title">Greeting Assignment List</h1> -->
  <div class="d-flex justify-space-between">
    <h1 class="page-title">Greeting Assignment List</h1>
    <v-btn prepend-icon="mdi-store-plus-outline" class="ml-4" variant="tonal"
      to="/manager-greeting-assignment/distribute">
      Distribute Greeting Assignment</v-btn>
  </div>
  <div class="page-section ma-0">
    <v-tabs v-model="tab" fixed-tabs>
      <v-tab value="new-assignment">New<v-badge inline rounded="sm" :content="newAssignmentCount"
          color="warning" /></v-tab>
      <v-tab value="idle-assignment">Idle<v-badge inline rounded="sm" :content="idleAssignmentCount"
          color="error" /></v-tab>
      <v-tab value="active-assignment">Active<v-badge inline rounded="sm" :content="activeAssignmentCount"
          color="grey" /></v-tab>
      <v-tab value="all-assignment">All<v-badge inline rounded="sm" :content="customerAssignmentCount"
          color="grey" /></v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item value="new-assignment">
        <ListNewAssignmentTab />
      </v-window-item>
      <v-window-item value="idle-assignment">
        <ListIdleAssignmentTab />
      </v-window-item>
      <v-window-item value="active-assignment">
        <ListActiveAssignmentTab />
      </v-window-item>
      <v-window-item value="all-assignment">
        <ListAllAssignmentTab />
      </v-window-item>
    </v-window>
  </div>
</template>

<script lang="ts" setup>
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, ref } from 'vue';
import ListAllAssignmentTab from './ListAllAssignmentTab.vue';
import ListActiveAssignmentTab from './ListActiveAssignmentTab.vue';
import ListNewAssignmentTab from './ListNewAssignmentTab.vue';
import ListIdleAssignmentTab from './ListIdleAssignmentTab.vue';
import { CustomerAssignmentStatus } from '@/shared-bc/domain/enum/customer-assignment-status';
import { useRoute } from 'vue-router';

const route = useRoute();
const tab = ref<string>('newAssignment')

const { managerRepository } = useDependencyInjection();
const customerAssignmentCount = ref<number>(0)
const newAssignmentCount = ref<number>(0)
const idleAssignmentCount = ref<number>(0)
const activeAssignmentCount = ref<number>(0)

onMounted(async () => {
  await viewSummary()
  tab.value = route.query.tab as string ?? "new-assignment"
})

const viewSummary = async () => {
  type ResponseType = {
    customerAssignmentCount: number,
    newAssignmentCount: number,
    idleAssignmentCount: number,
    activeAssignmentCount: number,
  }
  const response = await managerRepository.getUser()
    .executeManagerGraphqlQuery<ResponseType>([
      {
        operation: { name: "viewGreetingAssignmentCount", alias: "customerAssignmentCount" },
        variables: {},
        fields: []
      },
      {
        operation: { name: "viewGreetingAssignmentCount", alias: "newAssignmentCount" },
        variables: {
          newAssignmentFilters: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "GreetingAssignment.status", value: 'ACTIVE' },
              { column: "hasSalesActivitySchedule", value: false },
            ],
          }
        },
        fields: []
      },
      {
        operation: { name: "viewGreetingAssignmentCount", alias: "idleAssignmentCount" },
        variables: {
          assignmentWithoutActiveScheduleFilters: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "GreetingAssignment.status", value: CustomerAssignmentStatus.ACTIVE },
              { column: "hasSalesActivitySchedule", value: true },
              { column: "hasActiveSalesActivitySchedule", value: false },
            ],
          }
        },
        fields: []
      },
      {
        operation: { name: "viewGreetingAssignmentCount", alias: "activeAssignmentCount" },
        variables: {
          activeFilters: {
            type: "[FilterInput]", name: "filters",
            value: [{ column: "GreetingAssignment.status", value: CustomerAssignmentStatus.ACTIVE }]
          }
        },
        fields: []
      },
    ])
  customerAssignmentCount.value = response.customerAssignmentCount
  newAssignmentCount.value = response.newAssignmentCount
  idleAssignmentCount.value = response.idleAssignmentCount
  activeAssignmentCount.value = response.activeAssignmentCount
}

</script>

<style lang="scss" scoped></style>