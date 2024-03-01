<template>
  <h1 class="page-title">Manager Dashboard</h1>

  <section class="page-section ma-2" style="min-width: 48%;">
    <h2 class="section-title">Pending Good Fund Request</h2>
    <v-table density="compact" style="width: 100%;" class="datatable px-2">
      <thead>
        <tr>
          <th>sales</th>
          <th>customer</th>
          <th>transaction value</th>
          <th>note</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="pendingClosingRequests.length < 1">
          <td class="no-data" colspan="12">
            <div class="justify-center text-center pa-5">
              <img src="@/assets/images/image-no-data.svg" alt="No Data" /><br /><br />
              <span class="text-disabled text-body-1">No Pending Good Fund Request awaiting your response</span>
            </div>
          </td>
        </tr>
        <tr v-else v-for="(closingRequest, key) in pendingClosingRequests" :key="closingRequest.id ?? key">
          <td>{{ closingRequest.assignedCustomer?.sales?.personnel?.name }}</td>
          <td>
            {{ closingRequest.assignedCustomer?.customer?.name }}
          </td>
          <td>{{ closingRequest.transactionValue }}</td>
          <td>{{ useStringLimiter(closingRequest.note, 25) }}</td>
          <td>
            <v-btn variant="text" icon="mdi-close-circle-outline" size="x-small"
              @click="rejectClosingRequestConfirmation($event, closingRequest.id!)"></v-btn>
            <v-btn variant="text" icon="mdi-check-circle-outline" size="x-small"
              @click="approveClosingRequestConfirmation($event, closingRequest.id!)"></v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </section>

  <section class="page-section ma-2" style="min-width: 48%;">
    <h2 class="section-title">Pending Recycle Request</h2>
    <v-table density="compact" style="width: 100%;" class="datatable px-2">
      <thead>
        <tr>
          <th>sales</th>
          <th>customer</th>
          <th>note</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="pendingRecycleRequests.length < 1">
          <td class="no-data" colspan="12">
            <div class="justify-center text-center pa-5">
              <img src="@/assets/images/image-no-data.svg" alt="No Data" /><br /><br />
              <span class="text-disabled text-body-1">No Pending Recycle Request awaiting your response</span>
            </div>
          </td>
        </tr>
        <tr v-else v-for="(recycleRequest, key) in pendingRecycleRequests" :key="recycleRequest.id ?? key">
          <td>{{ recycleRequest.assignedCustomer?.sales?.personnel?.name }}</td>
          <td>
            {{ recycleRequest.assignedCustomer?.customer?.name }}
          </td>
          <td>{{ useStringLimiter(recycleRequest.note, 25) }}</td>
          <td>
            <v-btn variant="text" icon="mdi-close-circle-outline" size="x-small"
              @click="rejectRecycleRequestConfirmation($event, recycleRequest.id!)"></v-btn>
            <v-btn variant="text" icon="mdi-check-circle-outline" size="x-small"
              @click="approveRecycleRequestConfirmation($event, recycleRequest.id!)"></v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </section>
  <!--  -->
  <ConfirmPopup group="recycleRequest">
    <template #container="{ message, onAccept, onReject }">
      <div class="border-round p-3">
        <span>{{ message.message }}</span>
        <div class="flex align-items-center gap-2 mt-3">
          <v-text-field label="remark" v-model="remark" />
          <div class="d-flex justify-space-between">
            <v-btn variant="outlined" color="warning" @click="onReject">cancel</v-btn>
            <v-btn variant="outlined" @click="onAccept">continue</v-btn>
          </div>
        </div>
      </div>
    </template>
  </ConfirmPopup>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useStringLimiter } from "@/resources/composables/typography";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import CursorPagination from "@/resources/components/cursor-pagination";
import ManagerRole from "@/domain/user-role/personnel/manager-role";
import { PaginationResponseType } from "@/resources/components/abstract-pagination";
import { onMounted } from "vue";
import { ClosingRequestType } from "@/domain/model/personnel/manager/sales/assigned-customer/closing-request";
import RecycleRequest, { RecycleRequestType } from "@/domain/model/personnel/manager/sales/assigned-customer/recycle-request";
import { useConfirm } from "primevue/useconfirm";

const { httpRequest, userRepository } = useDependencyInjection()

const confirm = useConfirm();
const pendingClosingRequests = ref<ClosingRequestType[]>([])
const pendingRecycleRequests = ref<RecycleRequestType[]>([])

onMounted(async () => {
  const response = await userRepository.getUser<ManagerRole>()
    .executeManagerGraphqlQuery<{
      closingRequestList: PaginationResponseType<ClosingRequestType>,
      recycleRequestList: PaginationResponseType<RecycleRequestType>
    }>(httpRequest, [
      {
        operation: "closingRequestList",
        variables: {
          closingRequestFilter: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "ClosingRequest.status", value: 'WAITING_FOR_APPROVAL' },
            ]
          }
        },
        fields: CursorPagination.wrapResultFields([
          "id", "status", "createdTime", "note", "transactionValue",
          {
            assignedCustomer: ["id",
              { customer: ["name"] },
              { sales: [{ personnel: ["name"] }] }
            ]
          },
        ])
      },
      {
        operation: "recycleRequestList",
        variables: {
          recycleRequestFilter: {
            type: "[FilterInput]", name: "filters",
            value: [
              { column: "RecycleRequest.status", value: 'WAITING_FOR_APPROVAL' },
            ]
          }
        },
        fields: CursorPagination.wrapResultFields([
          "id", "status", "createdTime", "note",
          {
            assignedCustomer: ["id",
              { customer: ["name"] },
              { sales: [{ personnel: ["name"] }] }
            ]
          },
        ])
      },
    ])
  pendingClosingRequests.value = response.closingRequestList.list
  pendingRecycleRequests.value = response.recycleRequestList.list
})

const rejectClosingRequestConfirmation = (event: Event, closingRequestId: string) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to reject this closing request?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: () => {
      rejectClosingRequest(closingRequestId)
    },
    reject: () => { }
  });
};
const approveClosingRequestConfirmation = (event: Event, closingRequestId: string) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to approve this closing request?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-success',
    accept: () => {
      approveClosingRequest(closingRequestId)
    },
    reject: () => { }
  });
};

const rejectRecycleRequestConfirmation = (event: Event, recycleRequestId: string) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    group: "recycleRequest",
    message: 'Do you want to reject this recycle request?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: () => {
      rejectRecycleRequest(recycleRequestId)
    },
    reject: () => { }
  });
};
const approveRecycleRequestConfirmation = (event: Event, recycleRequestId: string) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    group: "recycleRequest",
    message: 'Do you want to approve this recycle request?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-success',
    accept: () => {
      approveRecycleRequest(recycleRequestId)
    },
    reject: () => { }
  });
};

const approveClosingRequest = async (closingRequestId: string) => {
  userRepository.getUser<ManagerRole>()
    .executeManagerGraphqlMutation<{ acceptClosingRequest: ClosingRequestType }>(httpRequest, {
      operation: "acceptClosingRequest",
      variables: { id: { type: "ID!", value: closingRequestId } },
      fields: ['status']
    }).then((result) => {
      //remove from pending list
    })
}

const remark = ref<string>('')
const rejectClosingRequest = async (closingRequestId: string) => {
  userRepository.getUser<ManagerRole>()
    .executeManagerGraphqlMutation<{ rejectClosingRequest: ClosingRequestType }>(httpRequest, {
      operation: "rejectClosingRequest",
      variables: { id: { type: "ID!", value: closingRequestId } },
      fields: ['status']
    }).then((result) => {
      //remove from pending list
    })
}

//
const approveRecycleRequest = async (recycleRequestId: string) => {
  userRepository.getUser<ManagerRole>()
    .executeManagerGraphqlMutation<{ approveRecycleRequest: RecycleRequestType }>(httpRequest, {
      operation: "approveRecycleRequest",
      variables: { id: { type: "ID!", value: recycleRequestId }, remark: remark.value },
      fields: ['status']
    }).then((result) => {
      //remove from pending list
    })
}
const rejectRecycleRequest = async (recycleRequestId: string) => {
  userRepository.getUser<ManagerRole>()
    .executeManagerGraphqlMutation<{ rejectRecycleRequest: RecycleRequestType }>(httpRequest, {
      operation: "rejectRecycleRequest",
      variables: { id: { type: "ID!", value: recycleRequestId }, remark: remark.value },
      fields: ['status']
    }).then((result) => {
      //remove from pending list
    })
}

const limitString = (string: string | undefined, size: number) => useStringLimiter(string, size) 
</script>

<script lang="ts">
export default {
  name: 'ManagerDashboard',
}
</script>

<style lang="scss" scoped></style>