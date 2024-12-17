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
          <th>rating</th>
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
          :key="customerAssignment.id ?? index" @click="toDetail(customerAssignment.id!)">
          <td>{{ customerAssignment.customer?.name }}</td>
          <td>{{ customerAssignment.customer?.email }}</td>
          <td>{{ customerAssignment.customer?.phone }}</td>
          <td><v-rating disabled :length="3" :size="16" :model-value="customerAssignment.customer?.rating"
              active-color="primary" /></td>
          <td>{{ customerAssignment.status }}</td>
          <td>{{ customerAssignment.customer?.city?.name }}</td>
        </tr>
      </tbody>
    </v-table>
  </OffsetPaginationComponent>
</template>

<script setup lang="ts">
import { GreetingAssignmentType } from '@/company-bc/domain/model/manager/sales/greeting-assignment';
import OffsetPaginationComponent from '@/resources/components/OffsetPaginationComponent.vue';
import OffsetPagination from '@/resources/components/offset-pagination';
import { useRouter } from 'vue-router';

defineProps<{ customerAssignmentPagination: OffsetPagination<GreetingAssignmentType> }>()
const router = useRouter();

const toDetail = (greetingAssignmentId: string) => router.push(`/sales-greeting-assignment/${greetingAssignmentId}`)

</script>

<style scoped></style>