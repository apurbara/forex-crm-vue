<template>
  <h1 class="page-title">Customer Assignment List</h1>
  <div class="page-section">
    <v-tabs v-model="tab" align-tabs="center" fixed-tabs density="comfortable">
      <v-tab value="idle-assignment"> idle
        <v-badge inline :content="idleAssignmentCount" color="warning" />
      </v-tab>
      <v-tab value="new-assignment"> new
        <v-badge inline rounded="sm" :content="newAssignmentCount" color="red" />
      </v-tab>
      <v-tab value="has-pending-closing-request"> has pending closing
        <v-badge inline rounded="sm" :content="pendingClosingRequestAssignmentCount" color="green" />
      </v-tab>
      <v-tab value="has-pending-recycle-request"> has pending recycle
        <v-badge inline rounded="sm" :content="pendingRecycleRequestAssignmentCount" color="green" />
      </v-tab>
      <v-tab value="active-assignment"> active
        <v-badge inline rounded="sm" :content="activeAssignmentCount" color="primary" />
      </v-tab>
      <v-tab value="all-assignment"> all assignment
        <v-badge inline rounded="sm" :content="allAssignmentCount" color="grey" />
      </v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item value="active-assignment">
        <ListActiveAssignmentTab class="page-section" />
      </v-window-item>
      <v-window-item value="new-assignment">
        <ListNewAssignmentTab class="page-section" />
      </v-window-item>
      <v-window-item value="idle-assignment">
        <ListIdleAssignmentTab class="page-section" />
      </v-window-item>
      <v-window-item value="has-pending-closing-request">
        <ListHasPendingClosingRequestAssignmentTab class="page-section" />
      </v-window-item>
      <v-window-item value="has-pending-recycle-request">
        <ListHasPendingRecycleRequestAssignmentTab class="page-section" />
      </v-window-item>
      <v-window-item value="all-assignment">
        <ListAllAssignmentTab class="page-section" />
      </v-window-item>
    </v-window>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import ListActiveAssignmentTab from './ListActiveAssignmentTab.vue';
import ListNewAssignmentTab from './ListNewAssignmentTab.vue';
import ListIdleAssignmentTab from './ListIdleAssignmentTab.vue';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { CustomerAssignmentStatus } from '@/shared-bc/domain/enum/customer-assignment-status';
import ListHasPendingClosingRequestAssignmentTab from './ListHasPendingClosingRequestAssignmentTab.vue';
import ListHasPendingRecycleRequestAssignmentTab from './ListHasPendingRecycleRequestAssignmentTab.vue';
import ListAllAssignmentTab from './ListAllAssignmentTab.vue';

const route = useRoute()
const { managerRepository } = useDependencyInjection();

const tab = ref<string>("active-assignment")
const activeAssignmentCount = ref<number>(0)
const newAssignmentCount = ref<number>(0)
const idleAssignmentCount = ref<number>(0)
const pendingClosingRequestAssignmentCount = ref<number>(0)
const pendingRecycleRequestAssignmentCount = ref<number>(0)
const allAssignmentCount = ref<number>(0)

onMounted(async () => {
  tab.value = route.query.tab as string ?? "idle-assignment"
  await fetchAssignmentSummary()
})

const fetchAssignmentSummary = async () => {
  type ResponseDataType = {
    activeAssignmentCount: number,
    newAssignmentCount: number,
    idleAssignmentCount: number,
    pendingClosingRequestAssignmentCount: number,
    pendingRecycleRequestAssignmentCount: number,
    allAssignmentCount: number,
  }
  const response = await managerRepository.getUser()
    .executeManagerGraphqlQuery<ResponseDataType>([
      {
        operation: { name: "viewCustomerAssignmentCount", alias: "activeAssignmentCount" },
        variables: {
          activeAssignmentFilters: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "CustomerAssignment.status", value: CustomerAssignmentStatus.ACTIVE },
            ],
          }
        },
        fields: []
      },
      {
        operation: { name: "viewCustomerAssignmentCount", alias: "newAssignmentCount" },
        variables: {
          newAssignmentFilters: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "CustomerAssignment.status", value: CustomerAssignmentStatus.ACTIVE },
              { column: "hasSalesActivitySchedule", value: false },
            ],
          }
        },
        fields: []
      },
      {
        operation: { name: "viewCustomerAssignmentCount", alias: "idleAssignmentCount" },
        variables: {
          idleAssignmentFilters: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "CustomerAssignment.status", value: CustomerAssignmentStatus.ACTIVE },
              { column: "hasSalesActivitySchedule", value: true },
              { column: "hasActiveSalesActivitySchedule", value: false },
              { column: "hasPendingClosingRequest", value: false },
              { column: "hasPendingRecycleRequest", value: false },
            ],
          }
        },
        fields: []
      },
      {
        operation: { name: "viewCustomerAssignmentCount", alias: "pendingClosingRequestAssignmentCount" },
        variables: {
          pendingClosingRequestAssignmentFilters: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "hasPendingClosingRequest", value: true },
            ],
          }
        },
        fields: []
      },
      {
        operation: { name: "viewCustomerAssignmentCount", alias: "pendingRecycleRequestAssignmentCount" },
        variables: {
          pendingRecycleRequestAssignmentFilters: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "hasPendingRecycleRequest", value: true },
            ],
          }
        },
        fields: []
      },
      {
        operation: { name: "viewCustomerAssignmentCount", alias: "allAssignmentCount" },
        variables: {},
        fields: []
      },
    ])
  activeAssignmentCount.value = response.activeAssignmentCount
  newAssignmentCount.value = response.newAssignmentCount
  idleAssignmentCount.value = response.idleAssignmentCount
  pendingClosingRequestAssignmentCount.value = response.pendingClosingRequestAssignmentCount
  pendingRecycleRequestAssignmentCount.value = response.pendingRecycleRequestAssignmentCount
  allAssignmentCount.value = response.allAssignmentCount
}

</script>

<style lang="scss" scoped></style>