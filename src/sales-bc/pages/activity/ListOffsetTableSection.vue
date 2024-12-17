<template>
  <OffsetPaginationComponent :pagination="activitySchedulePagination">
    <v-table height="402px" density="compact" style="width: 100%;" class="datatable px-2">
      <thead>
        <tr>
          <th>customer</th>
          <!-- <th>customer journey</th> -->
          <th>status</th>
          <th>time</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="activitySchedulePagination.resultList.length < 1">
          <td class="no-data" colspan="12">
            <div class="justify-center text-center pa-5">
              <img src="@/assets/images/image-no-data.svg" alt="No Data" /><br /><br />
              <span class="text-disabled text-body-1">Data Schedule kosong</span>
            </div>
          </td>
        </tr>
        <tr v-else v-for="(activity, index) in activitySchedulePagination.resultList" :key="activity.id ?? index"
          @click="toDetail(activity)">
          <td>{{ getCustomerName(activity) }}</td>
          <!-- <td>{{ activity.customerAssignment?.customerJourney?.name }}</td> -->
          <td>{{ activity.status }}</td>
          <td>{{ new Date(activity.startTime!).toLocaleDateString("id-ID") }} : {{ new
            Date(activity.startTime!).toLocaleTimeString("id-ID") }} - {{ new
              Date(activity.endTime!).toLocaleTimeString("id-ID") }}
          </td>
        </tr>
      </tbody>
    </v-table>
  </OffsetPaginationComponent>
</template>

<script setup lang="ts">
import { SalesActivityScheduleType } from '@/company-bc/domain/model/manager/sales/customer-assignment/sales-activity-schedule';
import OffsetPaginationComponent from '@/resources/components/OffsetPaginationComponent.vue';
import OffsetPagination from '@/resources/components/offset-pagination';
import { isNotEmpty } from '@/resources/composables/validator';
import { useRouter } from 'vue-router';

defineProps<{ activitySchedulePagination: OffsetPagination<SalesActivityScheduleType> }>()
const router = useRouter();

const toDetail = (activity: SalesActivityScheduleType) => {
  if (isNotEmpty(activity.greetingAssignment?.id)) {
    router.push(`/sales-greeting-assignment/${activity.greetingAssignment?.id}`);
  }
  if (isNotEmpty(activity.factFindingAssignment?.id)) {
    router.push(`/sales-fact-finding-assignment/${activity.factFindingAssignment?.id}`);
  }
  if (isNotEmpty(activity.strikingAssignment?.id)) {
    router.push(`/sales-striking-assignment/${activity.strikingAssignment?.id}`);
  }
}
// => router.push(`/sales-customer-assignment/${customerAssignmentId}`)

const getCustomerName = (activity: SalesActivityScheduleType) => {
  return activity.greetingAssignment?.customer?.name || activity.factFindingAssignment?.customer?.name || activity.strikingAssignment?.customer?.name;
}

</script>

<style scoped></style>