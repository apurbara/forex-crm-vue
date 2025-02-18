<template>
  <div class="page-section">
    <ProgressSpinner v-if="fetchingInitialData" />
    <div v-else>
      <h1 class="text-xl mt-1">Sales Activity List</h1>
      <CursorPaginationComponent :pagination="pagination">
        <template #editSection>
          <div
            v-if="customerAssignment?.status === CustomerAssignmentStatus.ACTIVE"
            class="d-flex justify-end ga-4 flex-wrap mb-2"
          >
            <Button
              icon="pi pi-calendar-clock"
              @click="displayNewScheduleDialog = true"
              label="Plan New Activity"
            />
            <Button
              icon="pi pi-whatsapp"
              label="Submit Activity Report"
              @click="showSubmitNonScheduledSalesActivityReportDialog"
            />
          </div>
        </template>
        <EmptyDataIllustrationComponent
          v-if="pagination.resultList.length < 1"
          message="no activity, plan new activity or call customer now"
        />
        <DataTable v-else :value="pagination.resultList" size="small" class="w-full text-sm mt-2">
          <Column
            :field="(activitySchedule) => activitySchedule.salesActivity?.name"
            header="Activity"
          ></Column>
          <Column header="Report Note">
            <template #body="{ data }">
              <p v-if="data.salesActivityReport">
                {{ data.salesActivityReport?.content }}
              </p>
              <Button
                v-else
                size="small"
                icon="pi pi-pen-to-square"
                label="Submit Report"
                @click="showSubmitSalesActivityReportDialog(data)"
              />
            </template>
          </Column>
          <Column
            :field="(activitySchedule) => new Date(activitySchedule.startTime!).toLocaleString('id-ID')"
            header="Time"
          ></Column>
        </DataTable>
      </CursorPaginationComponent>
    </div>
  </div>
  <Dialog
    v-model:visible="displayNewScheduleDialog"
    header="Submit Activity Plan"
    modal
    class="p-4 w-2/5"
  >
    <ListSubmitNewSalesActivityScheduleComponent
      class="mt-2"
      :customer-assignment-id="customerAssignmentId"
      @schedule-submitted="unshiftNewScheduleAndCloseDialog"
    />
  </Dialog>

  <Dialog
    v-model:visible="displayActivityReportDialog"
    class="w-1/2"
    modal
    @hide="() => (activeStepper = '1')"
  >
    <Stepper :value="activeStepper" linear>
      <StepList>
        <Step value="1">Submit Acvitity Report / Update Journey</Step>
        <Step value="2">Plan Activity / Finalize</Step>
      </StepList>
      <StepPanels>
        <StepPanel value="1">
          <ListSubmitSalesActivityReportComponent
            v-if="selectedSalesActivityScheduleToReport"
            :customer-assignment-id="customerAssignmentId"
            :sales-activity-schedule="selectedSalesActivityScheduleToReport"
            @report-submitted="saveReportAndOpenNextStep"
          />
          <ListSubmitNonScheduledSalesActivityReportComponent
            v-else
            :customer-assignment-id="customerAssignmentId"
            @report-submitted="saveNonScheduledReportAndOpenNextStep"
          />
        </StepPanel>
        <StepPanel value="2">
          <Tabs value="new-schedule">
            <TabList>
              <Tab value="new-schedule">Plan Next Schedule</Tab>
              <Tab value="closing">Request Closing</Tab>
              <Tab value="recycle">Request Recycle</Tab>
            </TabList>
            <TabPanels>
              <TabPanel value="new-schedule">
                <ListSubmitNewSalesActivityScheduleComponent
                  :customer-assignment-id="customerAssignmentId"
                  @schedule-submitted="unshiftNewScheduleAndCloseDialog"
                />
              </TabPanel>
              <TabPanel value="closing">
                <ListSubmitClosingRequestComponent
                  :customer-assignment-id="customerAssignmentId"
                  @request-submitted="
                    () =>
                      router.push(
                        `/sales/customer-assignment/${customerAssignmentId}/closing-request-log`
                      )
                  "
                />
              </TabPanel>
              <TabPanel value="recycle">
                <ListSubmitRecycleRequestComponent
                  :customer-assignment-id="customerAssignmentId"
                  @request-submitted="
                    () =>
                      router.push(
                        `/sales/customer-assignment/${customerAssignmentId}/recycle-request-log`
                      )
                  "
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </StepPanel>
      </StepPanels>
    </Stepper>
  </Dialog>
</template>

<script setup lang="ts">
import CursorPagination, { CursorLimit } from "@/resources/components/cursor-pagination";
import CustomerAssignment from "@/sales-bc/domain/model/sales/customer-assignment";
import { SalesActivityScheduleType } from "@/sales-bc/domain/model/sales/customer-assignment/salesActivitySchedule";
import SalesActivityScheduleService from "@/sales-bc/domain/service/sales-activity-schedule-service";
import { CustomerAssignmentStatus } from "@/shared-bc/domain/enum/customer-assignment-status";
import EmptyDataIllustrationComponent from "@/shared/components/EmptyDataIllustrationComponent.vue";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import Dialog from "primevue/dialog";
import { onMounted, reactive, ref } from "vue";
import ListSubmitNewSalesActivityScheduleComponent from "./ListSubmitNewSalesActivityScheduleComponent.vue";
import { useCustomerAssignmentStore } from "@/sales-bc/stores/customer-assignment-store";
import ListSubmitSalesActivityReportComponent from "./ListSubmitSalesActivityReportComponent.vue";
import { SalesActivityReportType } from "@/sales-bc/domain/model/sales/customer-assignment/sales-activity-schedule/sales-activity-report";
import ListSubmitClosingRequestComponent from "./ListSubmitClosingRequestComponent.vue";
import ListSubmitRecycleRequestComponent from "./ListSubmitRecycleRequestComponent.vue";
import CursorPaginationComponent from "@/resources/components/CursorPaginationComponent.vue";
import ListSubmitNonScheduledSalesActivityReportComponent from "./ListSubmitNonScheduledSalesActivityReportComponent.vue";
import { useRouter } from "vue-router";

const props = defineProps<{ customerAssignmentId: string }>();
const customerAssignmentStore = useCustomerAssignmentStore();
const customerAssignment = ref<CustomerAssignment>();
const { salesRepository } = useDependencyInjection();
const salesActivityScheduleService = new SalesActivityScheduleService(salesRepository.getUser());
const router = useRouter();

const cursorLimit = new CursorLimit();
cursorLimit.appliedOrder = { column: "SalesActivitySchedule.startTime", direction: "DESC" };
const pagination = reactive(
  new CursorPagination<SalesActivityScheduleType>(
    (pagination) => salesActivityScheduleService.salesActivityScheduleList(pagination),
    [],
    undefined,
    cursorLimit
  ).addHiddenFilter({
    column: "SalesActivitySchedule.CustomerAssignment_id",
    value: props.customerAssignmentId,
  })
);

const fetchingInitialData = ref(true);
onMounted(async () => {
  customerAssignment.value = await customerAssignmentStore.getCustomerAssignment(
    props.customerAssignmentId
  );
  await pagination.loadPage();
  //
  fetchingInitialData.value = false;
});

const displayNewScheduleDialog = ref<boolean>(false);
const unshiftNewScheduleAndCloseDialog = (schedule: SalesActivityScheduleType) => {
  pagination.resultList.unshift(schedule);
  displayNewScheduleDialog.value = false;
  displayActivityReportDialog.value = false;
};

const displayActivityReportDialog = ref(false);
const activeStepper = ref("1");
const selectedSalesActivityScheduleToReport = ref<SalesActivityScheduleType>();
const showSubmitSalesActivityReportDialog = (salesActivitySchedule: SalesActivityScheduleType) => {
  selectedSalesActivityScheduleToReport.value = salesActivitySchedule;
  displayActivityReportDialog.value = true;
};
const showSubmitNonScheduledSalesActivityReportDialog = () => {
  selectedSalesActivityScheduleToReport.value = undefined;
  displayActivityReportDialog.value = true;
};
const saveReportAndOpenNextStep = (salesActivityReport: SalesActivityReportType) => {
  selectedSalesActivityScheduleToReport.value!.salesActivityReport = salesActivityReport;
  activeStepper.value = "2";
};
const saveNonScheduledReportAndOpenNextStep = (
  salesActivitySchedule: SalesActivityScheduleType
) => {
  pagination.resultList.unshift(salesActivitySchedule);
  activeStepper.value = "2";
};
</script>

<style scoped></style>
