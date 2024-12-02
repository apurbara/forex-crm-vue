<template>
  <h1 class="page-title">Manager Dashboard</h1>
  <div class="d-flex justify-space-between flex-wrap">
    <NotificationCardComponent :title="`Pending Closing Request`" :info="pendingClosingRequestCount"
      @click="toClosingRequestPage()" />
    <NotificationCardComponent :title="`Idle Greeting`" :info="idleGreetingCount"
      @click="toGreetingPage('idle-assignment')" />
    <NotificationCardComponent :title="`Idle Fact Finding`" :info="idleFactFindingCount"
      @click="toFactFindingPage('idle-assignment')" />
    <NotificationCardComponent :title="`Idle Striking`" :info="idleStrikingCount"
      @click="toStrikingPage('idle-assignment')" />
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
const idleGreetingCount = ref<number>(0)
const idleFactFindingCount = ref<number>(0)
const idleStrikingCount = ref<number>(0)

const toClosingRequestPage = () => router.push(`/manager-closing-request`)
const toGreetingPage = (tab: string) => router.push(`/manager-greeting-assignment/?tab=${tab}`)
const toFactFindingPage = (tab: string) => router.push(`/manager-fact-finding-assignment/?tab=${tab}`)
const toStrikingPage = (tab: string) => router.push(`/manager-striking-assignment/?tab=${tab}`)

onMounted(async () => {
  type ResponseDataType = {
    viewClosingRequestCount: number;
    idleGreetingCount: number;
    idleFactFindingCount: number;
    idleStrikingCount: number;
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
        operation: { name: "viewGreetingAssignmentCount", alias: "idleGreetingCount" },
        variables: {
          idleGreetingFilters: {
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
        operation: { name: "viewFactFindingAssignmentCount", alias: "idleFactFindingCount" },
        variables: {
          idleFactFindingFilters: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "FactFindingAssignment.status", value: CustomerAssignmentStatus.ACTIVE },
              { column: "hasSalesActivitySchedule", value: true },
              { column: "hasActiveSalesActivitySchedule", value: false },
            ],
          }
        },
        fields: []
      },
      {
        operation: { name: "viewStrikingAssignmentCount", alias: "idleStrikingCount" },
        variables: {
          idleStrikingFilters: {
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
    ])
  pendingClosingRequestCount.value = response.viewClosingRequestCount
  idleGreetingCount.value = response.idleGreetingCount
})



</script>

<style scoped></style>