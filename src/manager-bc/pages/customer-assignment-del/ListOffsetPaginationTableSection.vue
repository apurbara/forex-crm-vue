<template>
  <OffsetPaginationComponent :pagination="customerAssignmentPagination">
    <v-table height="402px" density="compact" style="width: 100%;" class="datatable px-2">
      <thead>
        <tr>
          <th>customer</th>
          <th>sales</th>
          <th>journey</th>
          <th>status</th>
          <th>city</th>
          <th>assignment time</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="customerAssignmentPagination.resultList.length < 1">
          <td class="no-data" colspan="12">
            <div class="justify-center text-center pa-5">
              <img src="@/assets/images/image-no-data.svg" alt="No Data" /><br /><br />
              <span class="text-disabled text-body-1">Data Customer Assignment kosong</span>
            </div>
          </td>
        </tr>
        <tr v-else v-for="(customerAssignment, index) in customerAssignmentPagination.resultList"
          :key="customerAssignment.id ?? index" @dblclick="toDetail(customerAssignment.id!)">
          <td>{{ customerAssignment.customer?.name }}</td>
          <td>{{ customerAssignment.sales?.name }}</td>
          <td>{{ customerAssignment.customerJourney?.name }}</td>
          <td>{{ customerAssignment.status }}</td>
          <td>{{ customerAssignment.customer?.city?.name }}</td>
          <td>{{ new Date(customerAssignment.createdTime!).toLocaleString() }}</td>
        </tr>
      </tbody>
    </v-table>
  </OffsetPaginationComponent>
</template>

<script setup lang="ts">
import { CustomerAssignmentType } from '@/manager-bc/domain/model/manager/sales/customer-assignment';
import OffsetPaginationComponent from '@/resources/components/OffsetPaginationComponent.vue';
import OffsetPagination from '@/resources/components/offset-pagination';
import { useRouter } from 'vue-router';

defineProps<{ customerAssignmentPagination: OffsetPagination<CustomerAssignmentType> }>()
const router = useRouter();

const toDetail = (customerAssignmentId: string) => router.push(`/manager-customer-assignment/${customerAssignmentId}`)

</script>

<style scoped></style>