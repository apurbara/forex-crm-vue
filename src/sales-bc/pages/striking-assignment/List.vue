<template>
  <h1 class="page-title">Striking Assignment List</h1>
  <div class="page-section ma-0">
    <v-tabs v-model="tab" fixed-tabs>
      <v-tab value="new-assignment">New<v-badge inline rounded="sm" :content="newAssignmentCount"
          color="warning" /></v-tab>
      <v-tab value="idle-assignment">Idle<v-badge inline rounded="sm" :content="idleAssignmentCount"
          color="error" /></v-tab>
      <v-tab value="pending-closing">Closing<v-badge inline rounded="sm" :content="pendingClosingRequestAssignmentCount"
          color="primary" /></v-tab>
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
      <v-window-item value="pending-closing">
        <ListPendingClosingTab />
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
import ListPendingClosingTab from './ListPendingClosingTab.vue';

const route = useRoute();
const tab = ref<string>('newAssignment')

const { salesRepository } = useDependencyInjection();
const customerAssignmentCount = ref<number>(0)
const newAssignmentCount = ref<number>(0)
const idleAssignmentCount = ref<number>(0)
const pendingClosingRequestAssignmentCount = ref<number>(0)
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
    pendingClosingRequestAssignmentCount: number,
    activeAssignmentCount: number,
  }
  const response = await salesRepository.getUser()
    .executeSalesGraphqlQuery<ResponseType>([
      {
        operation: { name: "totalStrikingAssignment", alias: "customerAssignmentCount" },
        variables: {},
        fields: []
      },
      {
        operation: { name: "totalStrikingAssignment", alias: "newAssignmentCount" },
        variables: {
          newAssignmentCountFilters: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "StrikingAssignment.status", value: 'ACTIVE' },
              { column: "hasSalesActivitySchedule", value: false },
            ],
          }
        },
        fields: []
      },
      {
        operation: { name: "totalStrikingAssignment", alias: "idleAssignmentCount" },
        variables: {
          idleAssignmentCountFilters: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "StrikingAssignment.status", value: CustomerAssignmentStatus.ACTIVE },
              { column: "hasSalesActivitySchedule", value: true },
              { column: "hasActiveSalesActivitySchedule", value: false },
              { column: "hasPendingClosingRequest", value: false },
            ],
          }
        },
        fields: []
      },
      {
        operation: { name: "totalStrikingAssignment", alias: "pendingClosingRequestAssignmentCount" },
        variables: {
          pendingClosingRequestAssignmentCountFilters: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "StrikingAssignment.status", value: CustomerAssignmentStatus.ACTIVE },
              { column: "hasPendingClosingRequest", value: true },
            ],
          }
        },
        fields: []
      },
      {
        operation: { name: "totalStrikingAssignment", alias: "activeAssignmentCount" },
        variables: {
          activeAssignmentCountFilters: {
            type: "[FilterInput]", name: "filters",
            value: [{ column: "StrikingAssignment.status", value: CustomerAssignmentStatus.ACTIVE }]
          }
        },
        fields: []
      },
    ])
  customerAssignmentCount.value = response.customerAssignmentCount
  newAssignmentCount.value = response.newAssignmentCount
  idleAssignmentCount.value = response.idleAssignmentCount
  pendingClosingRequestAssignmentCount.value = response.pendingClosingRequestAssignmentCount
  activeAssignmentCount.value = response.activeAssignmentCount
}

</script>

<style lang="scss" scoped></style>