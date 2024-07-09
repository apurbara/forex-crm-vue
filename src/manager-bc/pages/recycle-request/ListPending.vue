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
          <th></th>
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
          @dblclick="toDetail(recycleRequest)">
          <td>{{ recycleRequest.customerAssignment?.customer?.name }}</td>
          <td>{{ recycleRequest.customerAssignment?.sales?.name }}</td>
          <td>{{ recycleRequest.status }}</td>
          <td>{{ recycleRequest.note }}</td>
          <td>{{ recycleRequest.remark }}</td>
          <td>{{ new Date(recycleRequest.createdTime!).toLocaleDateString() }}</td>
          <td>
            <div v-if="recycleRequest.status === ManagementApprovalStatus.WAITING_FOR_APPROVAL">
              <v-btn color="red" variant="text" icon="mdi-close-circle-outline"
                @click="rejectConfirmation($event, recycleRequest)"></v-btn>
              <v-btn color="green" variant="text" icon="mdi-check-circle-outline"
                @click="approveConfirmation($event, recycleRequest)"></v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
  </OffsetPaginationComponent>
</template>

<script lang="ts" setup>
import OffsetPaginationComponent from '@/resources/components/OffsetPaginationComponent.vue';
import { PaginationResponseType } from '@/resources/components/abstract-pagination';
import OffsetPagination from '@/resources/components/offset-pagination';
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useConfirm } from "primevue/useconfirm";
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { RecycleRequestType } from '@/company-bc/domain/model/sales/customer-assignment/recycle-request';
import { ManagementApprovalStatus } from '@/shared-bc/domain/enum/management-approval-status';
import EnumFilter from '@/resources/components/pagination/enum-filter';

const { managerRepository } = useDependencyInjection()
const router = useRouter();
const confirm = useConfirm();

const pagination = reactive(new OffsetPagination<RecycleRequestType>(
  async (pagination) => {
    const response = await managerRepository.getUser()
      .executeManagerGraphqlQuery<{ recycleRequestList: PaginationResponseType<RecycleRequestType> }>({
        operation: 'recycleRequestList',
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields([
          'id', 'status', 'createdTime', 'note', 'remark',
          {
            customerAssignment: ["id",
              { customer: ['name'] },
              { sales: ['name'] },
            ]
          }
        ])
      })!
    return response.recycleRequestList;
  },
))
pagination.addHiddenFilter({ column: 'RecycleRequest.status', value: ManagementApprovalStatus.WAITING_FOR_APPROVAL })

onMounted(async () => {
  await pagination.loadPage();
})

const toDetail = (recycleRequest: RecycleRequestType) => router.push(`/manager-customer-assignment/${recycleRequest.customerAssignment?.id}`)

const approveConfirmation = (event: Event, recycleRequest: RecycleRequestType) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to approve this request?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const response = await managerRepository.getUser()
        .executeManagerGraphqlMutation<{ approveRecycleRequest: RecycleRequestType }>({
          operation: "approveRecycleRequest",
          variables: { id: { type: "ID", value: recycleRequest.id } },
          fields: ['status']
        })
      recycleRequest.status = response.approveRecycleRequest.status;
    },
    reject: () => { }
  });
};
const rejectConfirmation = (event: Event, recycleRequest: RecycleRequestType) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to reject this request?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const response = await managerRepository.getUser()
        .executeManagerGraphqlMutation<{ rejectRecycleRequest: RecycleRequestType }>({
          operation: "rejectRecycleRequest",
          variables: { id: { type: "ID", value: recycleRequest.id } },
          fields: ['status']
        })
      recycleRequest.status = response.rejectRecycleRequest.status;
    },
    reject: () => { }
  });
};

</script>

<style lang="scss" scoped></style>