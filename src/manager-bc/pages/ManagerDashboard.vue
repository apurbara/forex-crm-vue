<template>
  <h1 class="page-title">Manager Dashboard</h1>
  <div class="d-flex justify-space-between flex-wrap">
    <NotificationCardComponent :title="`Pending Closing Request`" :info="pendingClosingRequestCount"
      @click="toClosingRequestPage()" />
    <NotificationCardComponent :title="`Pending Recycle Request`" :info="pendingRecycleRequestCount"
      @click="toRecycleRequestPage()" />
    <NotificationCardComponent :title="`Idle Assignment`" :info="idleAssignmentCount"
      @click="toAssignmentPage('idle-assignment')" />
    <NotificationCardComponent :title="`New Assignment`" :info="newAssignmentCount"
      @click="toAssignmentPage('new-assignment')" />
  </div>
  <ManagerDashboardManagerMetric />
  <ManagerDashboardSalesPerformanceMetric />
  <ManagerDashboardSalesRank />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ManagerDashboardSalesPerformanceMetric from './ManagerDashboardSalesPerformanceMetric.vue';
import ManagerDashboardSalesRank from './ManagerDashboardSalesRank.vue';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { ManagementApprovalStatus } from '@/shared-bc/domain/enum/management-approval-status';
import { CustomerAssignmentStatus } from '@/shared-bc/domain/enum/customer-assignment-status';
import { useRouter } from 'vue-router';
import NotificationCardComponent from '@/shared/components/NotificationCardComponent.vue';
import ManagerDashboardManagerMetric from './ManagerDashboardManagerMetric.vue';

const { managerRepository } = useDependencyInjection()
const router = useRouter()

const pendingClosingRequestCount = ref<number>(0)
const pendingRecycleRequestCount = ref<number>(0)
const idleAssignmentCount = ref<number>(0)
const newAssignmentCount = ref<number>(0)

const toClosingRequestPage = () => router.push(`/manager-closing-request`)
const toRecycleRequestPage = () => router.push(`/manager-recycle-request`)
const toAssignmentPage = (tab: string) => router.push(`/manager-customer-assignment/?tab=${tab}`)

onMounted(async () => {
  type ResponseDataType = {
    viewClosingRequestCount: number;
    viewRecycleRequestCount: number;
    idleAssignmentCount: number;
    newAssignmentCount: number;
  }
  const response = await managerRepository.getUser()
    .executeManagerGraphqlQuery<ResponseDataType>([
      {
        operation: "viewClosingRequestCount",
        variables: {
          pendingClosingRequestFilter: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "ClosingRequest.status", value: ManagementApprovalStatus.WAITING_FOR_APPROVAL }
            ]
          }
        },
        fields: []
      },
      {
        operation: "viewRecycleRequestCount",
        variables: {
          pendingRecycleRequestFilter: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "RecycleRequest.status", value: ManagementApprovalStatus.WAITING_FOR_APPROVAL }
            ]
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
              { column: "hasPendingRecycleRequest", value: false },
              { column: "hasPendingClosingRequest", value: false },
            ],
          }
        },
        fields: []
      },
    ])
  pendingClosingRequestCount.value = response.viewClosingRequestCount
  pendingRecycleRequestCount.value = response.viewRecycleRequestCount
  idleAssignmentCount.value = response.idleAssignmentCount
  newAssignmentCount.value = response.newAssignmentCount
})



</script>

<style scoped></style>