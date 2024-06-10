<template>
  <h1 class="page-title">Customer Assignment List</h1>
  <div>
    <v-tabs v-model="tab" fixed-tabs bg-color="primary">
      <v-tab value="allAssignment">All Assignment<v-badge inline :content="totalCustomerAssignment"
          color="grey" /></v-tab>
      <v-tab value="activeAssignment">Active Assignment <v-badge inline :content="totalActiveAssignment"
          color="white" /></v-tab>
      <v-tab value="newAssignment">New Assignment <v-badge inline :content="totalNewAssignment" color="red" /></v-tab>
      <v-tab value="idleAssignment">Idle Assignment <v-badge inline :content="totalIdleAssignment"
          color="warning" /></v-tab>
      <v-tab value="goodFund">Good Fund <v-badge inline :content="totalGoodfundAssignment" color="green" /></v-tab>
    </v-tabs>
    <div>
      <v-window v-model="tab">
        <v-window-item value="allAssignment">
          <ListAllAssignmentTab />
        </v-window-item>
        <v-window-item value="activeAssignment">
          <ListActiveAssignmentTab />
        </v-window-item>
        <v-window-item value="newAssignment">
          <ListNewAssignmentTab />
        </v-window-item>
        <v-window-item value="idleAssignment">
          <ListIdleAssignmentTab />
        </v-window-item>
        <v-window-item value="goodFund">
          <ListGoodFundTab />
        </v-window-item>
      </v-window>
    </div>
  </div>
</template>

<script lang="ts" setup>


import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, ref } from 'vue';
import ListAllAssignmentTab from './ListAllAssignmentTab.vue';
import ListActiveAssignmentTab from './ListActiveAssignmentTab.vue';
import ListNewAssignmentTab from './ListNewAssignmentTab.vue';
import ListIdleAssignmentTab from './ListIdleAssignmentTab.vue';
import ListGoodFundTab from './ListGoodFundTab.vue';
import { CustomerAssignmentStatus } from '@/shared-bc/domain/enum/customer-assignment-status';
import { useRoute } from 'vue-router';

const route = useRoute();
const tab = ref<string>('newAssignment')

const { httpRequest, salesRepository } = useDependencyInjection();
const totalCustomerAssignment = ref<number>(0)
const totalNewAssignment = ref<number>(0)
const totalIdleAssignment = ref<number>(0)
const totalActiveAssignment = ref<number>(0)
const totalGoodfundAssignment = ref<number>(0)


onMounted(async () => {
  await viewSummary()
  tab.value = route.query.tab as string ?? "newAssignment"
})

const viewSummary = async () => {
  const response = await salesRepository.getUser()
    .executeSalesGraphqlQuery<{
      totalCustomerAssignment: number,
      totalNewAssignment: number,
      totalIdleAssignment: number,
      totalActiveAssignment: number,
      totalGoodFundAssignment: number,
    }>(httpRequest, [
      {
        operation: "totalCustomerAssignment",
        variables: {},
        fields: []
      },
      {
        operation: { name: "totalCustomerAssignment", alias: "totalNewAssignment" },
        variables: {
          newAssignmentFilters: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "CustomerAssignment.status", value: 'ACTIVE' },
              { column: "newAssignment", value: true },
            ],
          }
        },
        fields: []
      },
      {
        operation: { name: "totalCustomerAssignment", alias: "totalIdleAssignment" },
        variables: {
          assignmentWithoutActiveScheduleFilters: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "CustomerAssignment.status", value: CustomerAssignmentStatus.ACTIVE },
              { column: "newAssignment", value: false },
              { column: "hasActiveSalesActivitySchedule", value: false },
            ],
          }
        },
        fields: []
      },
      {
        operation: { name: "totalCustomerAssignment", alias: "totalActiveAssignment" },
        variables: {
          activeFilters: {
            type: "[FilterInput]", name: "filters",
            value: [{ column: "CustomerAssignment.status", value: CustomerAssignmentStatus.ACTIVE }]
          }
        },
        fields: []
      },
      {
        operation: { name: "totalCustomerAssignment", alias: "totalGoodFundAssignment" },
        variables: {
          goodFundFilters: {
            type: "[FilterInput]", name: "filters",
            value: [{ column: "CustomerAssignment.status", value: CustomerAssignmentStatus.GOOD_FUND }],
          }
        },
        fields: []
      },
    ])
  totalCustomerAssignment.value = response.totalCustomerAssignment
  totalNewAssignment.value = response.totalNewAssignment
  totalIdleAssignment.value = response.totalIdleAssignment
  totalActiveAssignment.value = response.totalActiveAssignment
  totalGoodfundAssignment.value = response.totalGoodFundAssignment
}

</script>

<style lang="scss" scoped></style>