<template>
  <OffsetPaginationComponent :pagination="customerAssignmentPagination">
    <!-- <template v-slot:editSection>
      <v-btn prepend-icon="mdi-account-plus-outline" variant="tonal" to="/customer-assignment/register">Register
        Customer</v-btn>
    </template> -->
    <v-table height="402px" density="compact" style="width: 100%;" class="datatable">
      <thead>
        <tr>
          <th>name</th>
          <th>email</th>
          <th>phone</th>
          <th>status</th>
          <th>city</th>
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
          <td>{{ customerAssignment.customer?.city?.name }}</td>
        </tr>
      </tbody>
    </v-table>
  </OffsetPaginationComponent>
</template>

<script setup lang="ts">
import { FactFindingAssignmentType } from '@/company-bc/domain/model/manager/sales/fact-finding-assignment';
import OffsetPaginationComponent from '@/resources/components/OffsetPaginationComponent.vue';
import OffsetPagination from '@/resources/components/offset-pagination';
import { useRouter } from 'vue-router';

defineProps<{ customerAssignmentPagination: OffsetPagination<FactFindingAssignmentType> }>()
const router = useRouter();

const toDetail = (factFindingAssignmentId: string) => router.push(`/sales-fact-finding-assignment/${factFindingAssignmentId}`)

</script>

<style scoped></style>