<template>
  <OffsetPaginationComponent :pagination="pagination">
    <EmptyDataIllustrationComponent
      message="no pending recycle request"
      v-if="!pagination.resultList.length"
    />
    <DataTable v-else :value="pagination.resultList" size="small" class="w-full">
      <Column>
        <template #body="{ data }">
          <div class="flex justify-end align-center">
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
    <!-- <template v-slot:editSection>
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
    </v-table> -->
  </OffsetPaginationComponent>
</template>

<script lang="ts" setup>
import OffsetPaginationComponent from "@/resources/components/OffsetPaginationComponent.vue";
import { PaginationResponseType } from "@/resources/components/abstract-pagination";
import OffsetPagination from "@/resources/components/offset-pagination";
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { RecycleRequestType } from "@/company-bc/domain/model/sales/customer-assignment/recycle-request";
import { ManagementApprovalStatus } from "@/shared-bc/domain/enum/management-approval-status";
import EnumFilter from "@/resources/components/pagination/enum-filter";

const { managerRepository } = useDependencyInjection();
const router = useRouter();
const confirm = useConfirm();

const pagination = reactive(
  new OffsetPagination<RecycleRequestType>(async (pagination) => {
    const response = await managerRepository
      .getUser()
      .executeManagerGraphqlQuery<{
        recycleRequestList: PaginationResponseType<RecycleRequestType>;
      }>({
        operation: "recycleRequestList",
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields([
          "id",
          "status",
          "createdTime",
          "note",
          "remark",
          {
            customerAssignment: ["id", { customer: ["name"] }, { sales: ["name"] }],
          },
        ]),
      })!;
    return response.recycleRequestList;
  })
);
pagination.addHiddenFilter({
  column: "RecycleRequest.status",
  value: ManagementApprovalStatus.WAITING_FOR_APPROVAL,
});

onMounted(async () => {
  await pagination.loadPage();
});

const toDetail = (recycleRequest: RecycleRequestType) =>
  router.push(`/manager-customer-assignment/${recycleRequest.customerAssignment?.id}`);

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

<style lang="scss" scoped></style>
