<template>
  <OffsetPaginationComponent :pagination="pagination">
    <template v-slot:editSection>
    </template>
    <v-table height="400px" density="compact" style="width: 100%;" class="datatable">
      <thead>
        <tr>
          <th>customer</th>
          <th>sales</th>
          <th>status</th>
          <th>note</th>
          <th>remark</th>
          <th>created time</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="pagination.resultList.length < 1">
          <td class="no-data" colspan="12">
            <div class="justify-center text-center pa-5">
              <img src="@/assets/images/image-no-data.svg" alt="No Data" /><br /><br />
              <span class="text-disabled text-body-1">Data Recycle Request kosong</span>
            </div>
          </td>
        </tr>
        <tr v-else v-for="(recycleRequest, index) in pagination.resultList" :key="recycleRequest.id ?? index"
          @dblclick="toDetail(recycleRequest.id!)">
          <td>{{ recycleRequest.customerAssignment?.customer?.name }}</td>
          <td>{{ recycleRequest.customerAssignment?.sales?.name }}</td>
          <td>{{ recycleRequest.status }}</td>
          <td>{{ recycleRequest.note }}</td>
          <td>{{ recycleRequest.remark }}</td>
          <td>{{ new Date(recycleRequest.createdTime!).toLocaleDateString() }}</td>
        </tr>
      </tbody>
    </v-table>
  </OffsetPaginationComponent>
</template>

<script lang="ts" setup>
import OffsetPaginationComponent from '@/resources/components/OffsetPaginationComponent.vue';
import { PaginationResponseType } from '@/resources/components/abstract-pagination';
import OffsetPagination from '@/resources/components/offset-pagination';
import EnumFilter from '@/resources/components/pagination/enum-filter';
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { RecycleRequestType } from '@/company-bc/domain/model/sales/customer-assignment/recycle-request';
import { ManagementApprovalStatus } from '@/shared-bc/domain/enum/management-approval-status';

const { httpRequest, companyUserRepository } = useDependencyInjection()
const router = useRouter();

const pagination = reactive(new OffsetPagination<RecycleRequestType>(
  async (pagination) => {
    const response = await companyUserRepository.getUser()
      .executeGraphqlQueryInCompany<{ recycleRequestList: PaginationResponseType<RecycleRequestType> }>(httpRequest, {
        operation: 'recycleRequestList',
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields([
          'id', 'status', 'createdTime', 'transactionValue', 'note', 'remark',
          {
            customerAssignment: [
              { customer: ['name'] },
              { sales: ['name'] },
            ]
          }
        ])
      })!
    return response.recycleRequestList;
  },
  [
    new EnumFilter('status', 'RecycleRequest.status', () => [
      { value: ManagementApprovalStatus.APPROVED, label: ManagementApprovalStatus.APPROVED },
      { value: ManagementApprovalStatus.REJECTED, label: ManagementApprovalStatus.REJECTED },
    ])
  ]
))

onMounted(async () => {
  await pagination.loadPage();
})

const toDetail = (recyclerequestId: string) => router.push(`/recycle-request/${recyclerequestId}`)

</script>

<style lang="scss" scoped></style>