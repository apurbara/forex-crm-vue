<template>
  <div class="page-section text-sm">
    <h1 class="text-lg mt-1 text">Closing Request Log</h1>
    <DataTable :value="customerAssignment.closingRequests" size="small" fluid>
      <Column>
        <template #body="{ data }">
          <div class="flex justify-start gap-6 align-center">
            <p class="text-lg font-semibold">
              {{ data.transactionValue.toLocaleString("id-ID") }}
            </p>
            <p class="text-xs text-slate-400">
              {{ new Date(data.createdTime).toLocaleString("id-ID") }}
            </p>
          </div>
          <Tag
            v-if="data.status !== ManagementApprovalStatus.WAITING_FOR_APPROVAL"
            class="!text-xs mt-1"
            :severity="data.status === ManagementApprovalStatus.REJECTED ? 'danger' : 'success'"
            :value="data.status"
            rounded
          />
          <p class="text-sm text-stone-400 mt-2">{{ data.note }}</p>
        </template>
      </Column>
      <Column>
        <template #body="{ data }">
          <div
            v-if="data.status === ManagementApprovalStatus.WAITING_FOR_APPROVAL"
            class="flex flex-wrap gap-2"
          >
            <Button
              label="reject"
              size="small"
              severity="danger"
              icon="pi pi-times-circle"
              @click="rejectConfirmation($event, data)"
            ></Button>
            <Button
              label="approve"
              size="small"
              severity="success"
              icon="pi pi-check-circle"
              @click="approveConfirmation($event, data)"
            ></Button>
          </div>
        </template>
      </Column>
      <!-- <Column
        :field="(closingRequest) => new Date(closingRequest.createdTime).toLocaleString('id-ID')"
        header="Created Time"
      />
      <Column field="status" header="Status" />
      <Column
        :field="
          (closingRequest) =>
            new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
              closingRequest.transactionValue
            )
        "
        header="Transaction"
      />
      <Column field="note" header="Note" /> -->
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { CustomerAssignmentType } from "@/manager-bc/domain/model/manager/sales/customer-assignment";
import { ClosingRequestType } from "@/manager-bc/domain/model/manager/sales/customer-assignment/closing-request";
import { ManagementApprovalStatus } from "@/shared-bc/domain/enum/management-approval-status";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { useConfirm } from "primevue";

const props = defineProps<{ customerAssignment: CustomerAssignmentType }>();
const { managerRepository } = useDependencyInjection();
const confirm = useConfirm();

const approveConfirmation = (event: Event, closingRequest: ClosingRequestType) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: "Do you want to approve this request?",
    icon: "mdi mdi-alert-outline",
    acceptClass: "p-button-danger",
    accept: async () => {
      const response = await managerRepository
        .getUser()
        .executeManagerGraphqlMutation<{ acceptClosingRequest: ClosingRequestType }>({
          operation: "acceptClosingRequest",
          variables: { id: { type: "ID", value: closingRequest.id } },
          fields: ["status"],
        });
      closingRequest.status = response.acceptClosingRequest.status;
      // pagination.resultList.find(el => el.id === closingRequest.id)
    },
    reject: () => {},
  });
};
const rejectConfirmation = (event: Event, closingRequest: ClosingRequestType) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: "Do you want to reject this request?",
    icon: "mdi mdi-alert-outline",
    acceptClass: "p-button-danger",
    accept: async () => {
      const response = await managerRepository
        .getUser()
        .executeManagerGraphqlMutation<{ rejectClosingRequest: ClosingRequestType }>({
          operation: "rejectClosingRequest",
          variables: { id: { type: "ID", value: closingRequest.id } },
          fields: ["status"],
        });
      closingRequest.status = response.rejectClosingRequest.status;
    },
    reject: () => {},
  });
};
</script>

<style scoped></style>
