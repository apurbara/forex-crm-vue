<template>
  <div class="page-section">
    <ProgressSpinner v-if="fetchingCustomerAssignmentJourneyList" />
    <div v-else>
      <h1 class="text-xl mt-1">Customer Journey Log</h1>
      <CursorPaginationComponent :pagination="pagination">
        <EmptyDataIllustrationComponent
          message="no Journey Log found"
          v-if="!pagination.resultList.length"
        />
        <DataTable v-else :value="pagination.resultList" size="small" fluid>
          <Column
            :field="
              (customerAssignmentJourney) =>
                new Date(customerAssignmentJourney.startTime).toLocaleString('id-ID')
            "
            header="Start Time"
          />
          <Column
            :field="
              (customerAssignmentJourney) =>
                customerAssignmentJourney.endTime
                  ? new Date(customerAssignmentJourney.endTime).toLocaleString('id-ID')
                  : 'N/A'
            "
            header="End Time"
          />
          <Column
            :field="(customerAssignmentJourney) => customerAssignmentJourney.customerJourney.name"
            header="Journey"
          />
        </DataTable>
      </CursorPaginationComponent>
    </div>
  </div>
</template>

<script setup lang="ts">
import CursorPagination, { CursorLimit } from "@/resources/components/cursor-pagination";
import CursorPaginationComponent from "@/resources/components/CursorPaginationComponent.vue";
import { CustomerAssignmentJourneyPayload } from "@/sales-bc/domain/model/sales/customer-assignment/customer-assignment-journey-payload";
import CustomerAssignmentJourneyService from "@/sales-bc/domain/service/customer-assignment-journey-service";
import EmptyDataIllustrationComponent from "@/shared/components/EmptyDataIllustrationComponent.vue";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { onMounted, reactive, ref } from "vue";

const props = defineProps<{ customerAssignmentId: string }>();
const { salesRepository } = useDependencyInjection();
const customerAssignmentJourneyService = new CustomerAssignmentJourneyService(
  salesRepository.getUser()
);

const cursorLimit = new CursorLimit();
cursorLimit.appliedOrder = { column: "CustomerAssignmentJourney.startTime", direction: "DESC" };
const pagination = reactive(
  new CursorPagination<CustomerAssignmentJourneyPayload>(
    async (pagination) =>
      customerAssignmentJourneyService.viewCustomerAssignmentJourneyList(pagination),
    [],
    undefined,
    cursorLimit
  ).addHiddenFilter({
    column: "CustomerAssignmentJourney.CustomerAssignment_id",
    value: props.customerAssignmentId,
  })
);

const fetchingCustomerAssignmentJourneyList = ref(true);
onMounted(async () => {
  await pagination.loadPage();
  //
  fetchingCustomerAssignmentJourneyList.value = false;
});
</script>

<style scoped></style>
