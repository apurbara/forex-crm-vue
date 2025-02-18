<template>
  <div class="page-section">
    <ProgressSpinner v-if="fetchingRecycleList" />
    <div v-else>
      <h1 class="text-xl mt-1">Recycle Request Log</h1>
      <CursorPaginationComponent :pagination="pagination">
        <EmptyDataIllustrationComponent
          message="no recycle request found"
          v-if="!pagination.resultList.length"
        />
        <DataTable v-else :value="pagination.resultList" size="small" fluid>
          <Column
            :field="
              (recycleRequest) => new Date(recycleRequest.createdTime).toLocaleString('id-ID')
            "
            header="Created Time"
          />
          <Column field="status" header="note" />
          <Column field="note" header="Note" />
        </DataTable>
      </CursorPaginationComponent>
    </div>
  </div>
</template>

<script setup lang="ts">
import CursorPagination, { CursorLimit } from "@/resources/components/cursor-pagination";
import CursorPaginationComponent from "@/resources/components/CursorPaginationComponent.vue";
import { RecycleRequestType } from "@/sales-bc/domain/model/sales/customer-assignment/recycle-request";
import RecycleRequestService from "@/sales-bc/domain/service/recycle-request-service";
import EmptyDataIllustrationComponent from "@/shared/components/EmptyDataIllustrationComponent.vue";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { onMounted, reactive, ref } from "vue";

const props = defineProps<{ customerAssignmentId: string }>();
const { salesRepository } = useDependencyInjection();
const recycleRequestService = new RecycleRequestService(salesRepository.getUser());

const cursorLimit = new CursorLimit();
cursorLimit.appliedOrder = { column: "RecycleRequest.createdTime", direction: "DESC" };
const pagination = reactive(
  new CursorPagination<RecycleRequestType>(
    async (pagination) => recycleRequestService.recycleRequestList(pagination),
    [],
    undefined,
    cursorLimit
  ).addHiddenFilter({
    column: "RecycleRequest.CustomerAssignment_id",
    value: props.customerAssignmentId,
  })
);

const fetchingRecycleList = ref(true);
onMounted(async () => {
  await pagination.loadPage();
  //
  fetchingRecycleList.value = false;
});
</script>

<style scoped></style>
