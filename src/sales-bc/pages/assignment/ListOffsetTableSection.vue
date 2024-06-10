<template>
  <OffsetPaginationComponent :pagination="customerAssignmentPagination">
    <!-- <template v-slot:editSection>
      <v-btn prepend-icon="mdi-account-plus-outline" variant="tonal" to="/customer-assignment/register">Register
        Customer</v-btn>
    </template> -->
    <v-table height="402px" density="compact" style="width: 100%;" class="datatable px-2">
      <thead>
        <tr>
          <th>name</th>
          <th>email</th>
          <th>phone</th>
          <th>status</th>
          <th>area</th>
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
          <td>{{ customerAssignment.customer?.email }}</td>
          <td>{{ customerAssignment.customer?.phone }}</td>
          <td>{{ customerAssignment.status }}</td>
          <td>{{ customerAssignment.customer?.area?.name }}</td>
        </tr>
      </tbody>
    </v-table>
  </OffsetPaginationComponent>
</template>

<script setup lang="ts">
import OffsetPaginationComponent from '@/resources/components/OffsetPaginationComponent.vue';
import OffsetPagination from '@/resources/components/offset-pagination';
import { CustomerAssignmentType } from '@/sales-bc/domain/model/sales/customer-assignment';
import { useRouter } from 'vue-router';

defineProps<{ customerAssignmentPagination: OffsetPagination<CustomerAssignmentType> }>()
const router = useRouter();

const toDetail = (customerAssignmentId: string) => router.push(`/sales-customer-assignment/${customerAssignmentId}`)

</script>

<style scoped></style>