<template>
  <CursorPaginationComponent :pagination="customerAssignmentPagination">
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
  </CursorPaginationComponent>
</template>

<script lang="ts" setup>
import CursorPaginationComponent from '@/resources/components/CursorPaginationComponent.vue';
import { KeywordSearch, PaginationResponseType } from '@/resources/components/abstract-pagination';
import CursorPagination from '@/resources/components/cursor-pagination';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, reactive } from 'vue';
import { CustomerAssignmentStatus } from '@/shared-bc/domain/enum/customer-assignment-status';
import { useRouter } from 'vue-router';
import { StrikingAssignmentType } from '@/company-bc/domain/model/manager/sales/striking-assignment';

const { salesRepository } = useDependencyInjection();
const router = useRouter();

const customerAssignmentPagination = reactive(new CursorPagination<StrikingAssignmentType>(
  async (pagination) => {
    const response = await salesRepository.getUser()
      .executeSalesGraphqlQuery<{ strikingAssignmentList: PaginationResponseType<StrikingAssignmentType> }>({
        operation: "strikingAssignmentList",
        variables: pagination.toGraphqlVariables(),
        fields: CursorPagination.wrapResultFields(["id", "status", { customer: ["id", "name", "email", "phone", "rating", { city: ["name"] }] }])
      })
    return response.strikingAssignmentList;
  },
  [],
  new KeywordSearch(["Customer.name", "Customer.email", "Customer.phone"])
))

onMounted(async () => {
  customerAssignmentPagination.addHiddenFilter({ column: 'StrikingAssignment.Status', value: CustomerAssignmentStatus.ACTIVE });
  customerAssignmentPagination.addHiddenFilter({ column: 'hasSalesActivitySchedule', value: false });
  await customerAssignmentPagination.loadPage();
})

const toDetail = (strikingAssignmentId: string) => router.push(`/sales-striking-assignment/${strikingAssignmentId}`)

</script>

<style lang="scss" scoped></style>