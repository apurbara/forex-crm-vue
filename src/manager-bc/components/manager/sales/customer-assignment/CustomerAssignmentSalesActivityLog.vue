<template>
  <div class="page-section">
    <h1 class="text-xl mt-1">Sales Activity List</h1>
    <EmptyDataIllustrationComponent
      v-if="!customerAssignment.salesActivitySchedules?.length"
      message="no activity, plan new activity or call customer now"
    />
    <DataTable
      v-else
      :value="customerAssignment.salesActivitySchedules"
      size="small"
      class="w-full text-sm mt-2"
    >
      <Column
        :field="(activitySchedule) => activitySchedule.salesActivity?.name"
        header="Activity"
      ></Column>
      <Column header="Report Note">
        <template #body="{ data }">
          <p v-if="data.salesActivityReport">
            {{ data.salesActivityReport?.content }}
          </p>
          <p v-else class="text-red-400">Incomplete Activity</p>
        </template>
      </Column>
      <Column
        :field="(activitySchedule) => new Date(activitySchedule.startTime!).toLocaleString('id-ID')"
        header="Time"
      ></Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import EmptyDataIllustrationComponent from "@/shared/components/EmptyDataIllustrationComponent.vue";
import { CustomerAssignmentType } from "@/manager-bc/domain/model/manager/sales/customer-assignment";

const props = defineProps<{ customerAssignment: CustomerAssignmentType }>();
</script>

<style scoped></style>
