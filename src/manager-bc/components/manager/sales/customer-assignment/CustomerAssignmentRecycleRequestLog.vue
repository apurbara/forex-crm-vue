<template>
  <div class="page-section text-sm">
    <h1 class="text-lg mt-1">Recycle Request Log</h1>
    <DataTable :value="customerAssignment.recycleRequests" size="small" fluid>
      <Column>
        <template #body="{ data }">
          <div class="flex justify-start align-center">
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
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { CustomerAssignmentType } from "@/manager-bc/domain/model/manager/sales/customer-assignment";
import { RecycleRequestType } from "@/manager-bc/domain/model/manager/sales/customer-assignment/recycle-request";
import { ManagementApprovalStatus } from "@/shared-bc/domain/enum/management-approval-status";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { useConfirm } from "primevue";

defineProps<{ customerAssignment: CustomerAssignmentType }>();
const { managerRepository } = useDependencyInjection();
const confirm = useConfirm();

const approveConfirmation = (event: Event, recycleRequest: RecycleRequestType) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: "Do you want to approve this request?",
    icon: "mdi mdi-alert-outline",
    acceptClass: "p-button-danger",
    accept: async () => {
      const response = await managerRepository
        .getUser()
        .executeManagerGraphqlMutation<{ approveRecycleRequest: RecycleRequestType }>({
          operation: "approveRecycleRequest",
          variables: { id: { type: "ID", value: recycleRequest.id } },
          fields: ["status"],
        });
      recycleRequest.status = response.approveRecycleRequest.status;
    },
    reject: () => {},
  });
};
const rejectConfirmation = (event: Event, recycleRequest: RecycleRequestType) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: "Do you want to reject this request?",
    icon: "mdi mdi-alert-outline",
    acceptClass: "p-button-danger",
    accept: async () => {
      const response = await managerRepository
        .getUser()
        .executeManagerGraphqlMutation<{ rejectRecycleRequest: RecycleRequestType }>({
          operation: "rejectRecycleRequest",
          variables: { id: { type: "ID", value: recycleRequest.id } },
          fields: ["status"],
        });
      recycleRequest.status = response.rejectRecycleRequest.status;
    },
    reject: () => {},
  });
};
</script>

<style scoped></style>
