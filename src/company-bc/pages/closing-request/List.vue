<template>
  <h1 class="page-title">Closing Request List</h1>
  <OffsetPaginationComponent :pagination="pagination">
    <template v-slot:editSection>
      <v-btn prepend-icon="mdi-account-plus-outline" variant="tonal" to="/closing-request/add">Add
        Closing Request</v-btn>
    </template>
    <v-table height="400px" density="compact" style="width: 100%;" class="datatable">
      <thead>
        <tr>
          <th>customer</th>
          <th>sales</th>
          <th>status</th>
          <th>transaction value</th>
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
              <span class="text-disabled text-body-1">Data Closing Request kosong</span>
            </div>
          </td>
        </tr>
        <tr v-else v-for="(closingRequest, index) in pagination.resultList" :key="closingRequest.id ?? index"
          @dblclick="toDetail(closingRequest.id!)">
          <td>{{ closingRequest.customerAssignment?.customer?.name }}</td>
          <td>{{ closingRequest.customerAssignment?.sales?.name }}</td>
          <td>{{ closingRequest.status }}</td>
          <td>{{ useThousandSeparator(closingRequest.transactionValue!) }}</td>
          <td>{{ closingRequest.note }}</td>
          <td>{{ closingRequest.remark }}</td>
          <td>{{ new Date(closingRequest.createdTime!).toLocaleDateString() }}</td>
          <td>
            <div v-if="closingRequest.status === ManagementApprovalStatus.WAITING_FOR_APPROVAL">
              <v-btn color="red" variant="text" icon="mdi-close-circle-outline"
                @click="rejectConfirmation($event, closingRequest)"></v-btn>
              <v-btn color="green" variant="text" icon="mdi-check-circle-outline"
                @click="approveConfirmation($event, closingRequest)"></v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
  </OffsetPaginationComponent>
</template>

<script lang="ts" setup>
import OffsetPaginationComponent from '@/resources/components/OffsetPaginationComponent.vue';
import { KeywordSearch, PaginationResponseType } from '@/resources/components/abstract-pagination';
import OffsetPagination from '@/resources/components/offset-pagination';
import EnumFilter from '@/resources/components/pagination/enum-filter';
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useConfirm } from "primevue/useconfirm";
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { ClosingRequestType } from '@/company-bc/domain/model/sales/customer-assignment/closing-request';
import { ManagementApprovalStatus } from '@/shared-bc/domain/enum/management-approval-status';
import { useThousandSeparator } from '@/resources/composables/typography';

const { httpRequest, companyUserRepository } = useDependencyInjection()
const router = useRouter();
const confirm = useConfirm();

const pagination = reactive(new OffsetPagination<ClosingRequestType>(
  async (pagination) => {
    const response = await companyUserRepository.getUser()
      .executeGraphqlQueryInCompany<{ closingRequestList: PaginationResponseType<ClosingRequestType> }>(httpRequest, {
        operation: 'closingRequestList',
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
    return response.closingRequestList;
  },
  [
    new EnumFilter('status', 'ClosingRequest.status', () => Object.keys(ManagementApprovalStatus).map(key => { return { name: key, value: key } }), 'IN', undefined, 'name', 'value'),
  ],
  new KeywordSearch(["ClosingRequest.name", "ClosingRequest.description"])
))

onMounted(async () => {
  await pagination.loadPage();
})

const toDetail = (closingrequestId: string) => router.push(`/closing-request/${closingrequestId}`)

const approveConfirmation = (event: Event, closingRequest: ClosingRequestType) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to approve this request?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const response = await companyUserRepository.getUser()
        .executeGraphqlMutationInCompany<{ acceptClosingRequest: ClosingRequestType }>(httpRequest, {
          operation: "acceptClosingRequest",
          variables: { id: { type: "ID", value: closingRequest.id } },
          fields: ['status']
        })
      closingRequest.status = response.acceptClosingRequest.status;
    },
    reject: () => { }
  });
};
const rejectConfirmation = (event: Event, closingRequest: ClosingRequestType) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to reject this request?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const response = await companyUserRepository.getUser()
        .executeGraphqlMutationInCompany<{ rejectClosingRequest: ClosingRequestType }>(httpRequest, {
          operation: "rejectClosingRequest",
          variables: { id: { type: "ID", value: closingRequest.id } },
          fields: ['status']
        })
      closingRequest.status = response.rejectClosingRequest.status;
    },
    reject: () => { }
  });
};

</script>

<style lang="scss" scoped></style>