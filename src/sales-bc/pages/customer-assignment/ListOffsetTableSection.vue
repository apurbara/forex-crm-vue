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
      <tbody class="h-full">
        <tr v-if="customerAssignmentPagination.resultList.length < 1">
          <td class="no-data" colspan="12">
            <EmptyDataIllustrationComponent message="Data Assignment Kosong" />
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
import OffsetPaginationComponent from '@/resources/components/OffsetPaginationComponent.vue';
import OffsetPagination from '@/resources/components/offset-pagination';
import { CustomerAssignmentType } from '@/sales-bc/domain/model/sales/customer-assignment';
import EmptyDataIllustrationComponent from '@/shared/components/EmptyDataIllustrationComponent.vue';
import { useRouter } from 'vue-router';

defineProps<{ customerAssignmentPagination: OffsetPagination<CustomerAssignmentType> }>()
const router = useRouter();

const toDetail = (customerAssignmentId: string) => router.push(`/sales/customer-assignment/${customerAssignmentId}`)

</script>

<style scoped></style>