<template>
  <section class="page-section ma-2" v-if="strikingAssignment.closingRequests?.length ?? 0 > 0">
    <h2 class="section-title">Closing Request Log</h2>
    <v-table density="compact" style="width: 100%;" class="datatable px-2">
      <thead>
        <tr>
          <th>time</th>
          <th>transaction value</th>
          <th>note</th>
          <th>remark</th>
          <th width="150px">status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(closingRequest, key) in strikingAssignment.closingRequests" :key="closingRequest.id ?? key">
          <td>{{ new Date(closingRequest.createdTime!).toLocaleString() }}</td>
          <td>{{ useThousandSeparator(closingRequest.transactionValue!) }}</td>
          <td>{{ closingRequest.note }}</td>
          <td>{{ closingRequest.remark }}</td>
          <td v-if="closingRequest.status === ManagementApprovalStatus.WAITING_FOR_APPROVAL">
            <div>
              <v-btn color="red" variant="text" icon="mdi-close-circle-outline"
                @click="rejectConfirmation($event, closingRequest)"></v-btn>
              <v-btn color="green" variant="text" icon="mdi-check-circle-outline"
                @click="approveConfirmation($event, closingRequest)"></v-btn>
            </div>
          </td>
          <td v-else>{{ closingRequest.status }}</td>
        </tr>
      </tbody>
    </v-table>
  </section>
</template>

<script setup lang="ts">
import { StrikingAssignmentType } from '@/company-bc/domain/model/manager/sales/striking-assignment';
import { ClosingRequestType } from '@/company-bc/domain/model/manager/sales/striking-assignment/closing-request';
import { useThousandSeparator } from '@/resources/composables/typography';
import { ManagementApprovalStatus } from '@/shared-bc/domain/enum/management-approval-status';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { useConfirm } from 'primevue/useconfirm';

const { managerRepository } = useDependencyInjection();
const confirm = useConfirm();

defineProps<{ strikingAssignment: StrikingAssignmentType }>();

const approveConfirmation = (event: Event, closingRequest: ClosingRequestType) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to approve this request?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const response = await managerRepository.getUser()
        .executeManagerGraphqlMutation<{ acceptClosingRequest: ClosingRequestType }>({
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
      const response = await managerRepository.getUser()
        .executeManagerGraphqlMutation<{ rejectClosingRequest: ClosingRequestType }>({
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

<style scoped></style>