<template>
  <div class="page-section">
    <ProgressSpinner v-if="fetchingClosingList" />
    <div v-else>
      <h1 class="text-xl mt-1 text">Closing Request Log</h1>
      <CursorPaginationComponent :pagination="pagination">
        <EmptyDataIllustrationComponent
          message="no closing request found"
          v-if="!pagination.resultList.length"
        />
        <DataTable v-else :value="pagination.resultList" size="small" fluid>
          <Column
            :field="
              (closingRequest) => new Date(closingRequest.createdTime).toLocaleString('id-ID')
            "
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
          <Column field="note" header="Note" />
        </DataTable>
      </CursorPaginationComponent>
    </div>
  </div>
</template>

<script setup lang="ts">
import CursorPagination, { CursorLimit } from "@/resources/components/cursor-pagination";
import CursorPaginationComponent from "@/resources/components/CursorPaginationComponent.vue";
import { ClosingRequestType } from "@/sales-bc/domain/model/sales/customer-assignment/closing-request";
import ClosingRequestService from "@/sales-bc/domain/service/closing-request-service";
import EmptyDataIllustrationComponent from "@/shared/components/EmptyDataIllustrationComponent.vue";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { onMounted, reactive, ref } from "vue";

const props = defineProps<{ customerAssignmentId: string }>();
const { salesRepository } = useDependencyInjection();
const closingRequestService = new ClosingRequestService(salesRepository.getUser());

const cursorLimit = new CursorLimit();
cursorLimit.appliedOrder = { column: "ClosingRequest.createdTime", direction: "DESC" };
const pagination = reactive(
  new CursorPagination<ClosingRequestType>(
    async (pagination) => closingRequestService.closingRequestList(pagination),
    [],
    undefined,
    cursorLimit
  ).addHiddenFilter({
    column: "ClosingRequest.CustomerAssignment_id",
    value: props.customerAssignmentId,
  })
);

const fetchingClosingList = ref(true);
onMounted(async () => {
  await pagination.loadPage();
  //
  fetchingClosingList.value = false;
});
</script>

<style scoped></style>
