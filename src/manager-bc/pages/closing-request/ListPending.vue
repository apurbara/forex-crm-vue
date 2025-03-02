<template>
  <OffsetPaginationComponent :pagination="pagination">
    <EmptyDataIllustrationComponent
      message="no pending closing request"
      v-if="!pagination.resultList.length"
    />
    <DataTable
      v-else
      :value="pagination.resultList"
      size="small"
      class="w-full"
      selectionMode="single"
      @row-click="(event) => router.push(`/manager/customer-assignment/${event.data.customerAssignment.id}`)"
    >
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
          <div class="flex gap-4 mt-1">
            <div class="flex gap-2 justify-start align-center text-base">
              <span class="mdi mdi-account-tie !text-sm px-1 bg-sky-200 rounded-md"></span>
              <p class="text-nowrap">{{ data.customerAssignment?.customer?.name }}</p>
            </div>
            <div class="flex gap-2 justify-start align-center text-sm text-stone-600">
              <span
                class="mdi mdi-account-circle-outline !text-base px-1 bg-slate-200 rounded-md"
              ></span>
              <p class="text-nowrap">{{ data.customerAssignment?.sales?.name }}</p>
            </div>
          </div>
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
  </OffsetPaginationComponent>
</template>

<script lang="ts" setup>
import OffsetPaginationComponent from "@/resources/components/OffsetPaginationComponent.vue";
import { useStringLimiter } from "@/resources/composables/typography";
import { PaginationResponseType } from "@/resources/components/abstract-pagination";
import OffsetPagination from "@/resources/components/offset-pagination";
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { ManagementApprovalStatus } from "@/shared-bc/domain/enum/management-approval-status";
import { useThousandSeparator } from "@/resources/composables/typography";
import { ClosingRequestType } from "@/manager-bc/domain/model/manager/sales/customer-assignment/closing-request";
import EmptyDataIllustrationComponent from "@/shared/components/EmptyDataIllustrationComponent.vue";

const { managerRepository } = useDependencyInjection();
const router = useRouter();
const confirm = useConfirm();

const pagination = reactive(
  new OffsetPagination<ClosingRequestType>(async (pagination) => {
    const response = await managerRepository.getUser().executeManagerGraphqlQuery<{
      closingRequestList: PaginationResponseType<ClosingRequestType>;
    }>({
      operation: "closingRequestList",
      variables: pagination.toGraphqlVariables(),
      fields: OffsetPagination.wrapResultFields([
        "id",
        "status",
        "createdTime",
        "transactionValue",
        "note",
        "remark",
        {
          customerAssignment: ["id", { customer: ["name"] }, { sales: ["name"] }],
        },
      ]),
    })!;
    return response.closingRequestList;
  })
);
pagination.addHiddenFilter({
  column: "ClosingRequest.status",
  value: ManagementApprovalStatus.WAITING_FOR_APPROVAL,
});

onMounted(async () => {
  await pagination.loadPage();
});

const toDetail = (closingRequest: ClosingRequestType) =>
  router.push(`/manager-customer-assignment/${closingRequest.customerAssignment?.id}`);

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

const limitString = (string: string | undefined, length: number) => {
  return useStringLimiter(string, length);
};
</script>

<style lang="scss" scoped></style>
