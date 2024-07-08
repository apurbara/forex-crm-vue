<template>
  <h1 class="page-title">Closing Request List</h1>
  <div class="page-section">
    <v-tabs v-model="tab" align-tabs="start" fixed-tabs density="comfortable">
      <v-tab value="pending"> pending
        <v-badge rounded="sm" inline :content="pendingRequestCount" color="warning" />
      </v-tab>
      <v-tab value="completed"> completed
        <v-badge rounded="sm" inline :content="completedRequestCount" color="success" />
      </v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item value="pending">
        <ListPending class="page-section" />
      </v-window-item>
      <v-window-item value="completed">
        <ListCompleted class="page-section" />
      </v-window-item>
    </v-window>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import ListPending from './ListPending.vue';
import ListCompleted from './ListCompleted.vue';
import { ManagementApprovalStatus } from '@/shared-bc/domain/enum/management-approval-status';

const route = useRoute()
const { companyUserRepository, httpRequest } = useDependencyInjection();

const tab = ref<string>("active-assignment")
const pendingRequestCount = ref<number>(0)
const completedRequestCount = ref<number>(0)

onMounted(async () => {
  tab.value = route.query.tab as string ?? "pending"
  await fetchCountSummary()
})

const fetchCountSummary = async () => {
  type ResponseDataType = {
    pendingRequestCount: number,
    completedRequestCount: number,
  }
  const response = await companyUserRepository.getUser()
    .executeGraphqlQueryInCompany<ResponseDataType>(httpRequest, [
      {
        operation: { name: "viewClosingRequestCount", alias: "pendingRequestCount" },
        variables: {
          pendingRequestFilters: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "ClosingRequest.status", value: ManagementApprovalStatus.WAITING_FOR_APPROVAL },
            ],
          }
        },
        fields: []
      },
      {
        operation: { name: "viewClosingRequestCount", alias: "completedRequestCount" },
        variables: {
          completedRequestFilters: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "ClosingRequest.status", value: ManagementApprovalStatus.WAITING_FOR_APPROVAL, comparisonType: "NEQ" },
            ],
          }
        },
        fields: []
      },
    ])
  pendingRequestCount.value = response.pendingRequestCount
  completedRequestCount.value = response.completedRequestCount
}

</script>

<style lang="scss" scoped></style>