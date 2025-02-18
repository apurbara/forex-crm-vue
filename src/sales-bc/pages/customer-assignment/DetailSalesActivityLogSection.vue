<template>
  <section class="page-section">
    <div
      v-if="customerAssignment.status === CustomerAssignmentStatus.ACTIVE"
      class="d-flex justify-end ga-4 flex-wrap mb-2"
    >
      <Button
        v-if="customerAssignment.isIdleAssignment()"
        icon="pi pi-calendar-clock"
        @click="displayNewScheduleDialog = true"
        label="Plan New Activity"
      />
      <Button
        icon="pi pi-whatsapp"
        @click="displayActivityReportDialog = true"
        label="Submit Activity Report"
      />
    </div>
    <EmptyDataIllustrationComponent
      v-if="customerAssignment.salesActivitySchedules.length < 1"
      message="no activity, plan new activity or call customer now"
    />
    <DataTable
      v-else
      :value="customerAssignment.salesActivitySchedules"
      size="small"
      class="w-full text-sm mt-2"
    >
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
            @click="showActivityReportDialog(data)"
          />
        </template>
      </Column>
      <Column
        :field="(activitySchedule) => new Date(activitySchedule.startTime!).toLocaleString('id-ID')"
        header="Time"
      ></Column>
    </DataTable>
  </section>

  <!-- <OverlayPanel ref="op" showCloseIcon style="width: 600px">
    <div class="pa-4">{{ selectedReport?.content }}</div>
  </OverlayPanel> -->
  <Dialog
    v-model:visible="displayNewScheduleDialog"
    header="Submit Activity Plan"
    modal
    class="p-4 w-2/5"
  >
    <div class="mt-1">
      <SubmitSalesActivityScheduleComponent :sales-activity-schedule="newActivitySchedule" />
      <div class="flex justify-end mt-4">
        <Button @click="submitNewSchedule" label="Submit" :loading="submittingNewSchedule" />
      </div>
    </div>
  </Dialog>

  <Dialog v-model:visible="displayActivityReportDialog" class="w-1/2" modal>
    <Stepper :value="activeStepper" :linear="true">
      <StepList>
        <Step value="1">Submit Acvitity Report / Update Journey</Step>
        <Step value="2">Plan Activity / Finalize</Step>
      </StepList>
      <StepPanels>
        <StepPanel value="1">
          <div class="flex flex-col h-max">
            <div>
              <IdeaComponent class="mt-4" :idea="idea" />
              <ProgressSpinner v-if="fetchingAllActiveInnovationAreaList" />
              <section class="mt-2" v-else>
                <h3 class="text-lg font-semibold">Associate With Innovation Area</h3>
                <div class="flex flex-wrap gap-2">
                  <v-checkbox
                    v-for="(innovationArea, key) in allActiveInnovationAreaList"
                    :key="innovationArea.id ?? key"
                    density="compact"
                    :label="innovationArea.name"
                    v-model="idea.innovationAreaAssociations"
                    :value="innovationArea"
                  ></v-checkbox>
                </div>
              </section>
            </div>
            <div class="flex pt-6 justify-end gap-3">
              <Button @click="closeDialog" severity="danger">
                <p class="font-semibold">Cancel</p>
              </Button>
              <Button
                :disabled="!idea.isValidIdea()"
                :loading="creatingIdea"
                @click="create"
                severity="success"
              >
                <p class="font-semibold">Submit and Continue</p>
              </Button>
            </div>
          </div>
        </StepPanel>
        <StepPanel value="2">
          <div class="flex flex-col h-max">
            <div>
              <IdeaTypeAssociationComponent v-if="contributorRepository.contributor" :idea="idea" />
            </div>
            <div class="flex justify-end pt-6">
              <Button @click="$emit('ideaSubmitted', idea.id!)" severity="primary"
                ><Icon class="pi pi-check"></Icon>
                <p class="font-semibold">Submit and Done</p></Button
              >
            </div>
          </div>
        </StepPanel>
      </StepPanels>
    </Stepper>
    <!-- <Stepper value="1">
      <StepList>
        <Step value="1">Submit Activity And Update Journey</Step>
        <Step value="2">Plan Activity / Finalize</Step>
      </StepList>
      <StepPanels>
        <StepPanel v-slot="{ activateCallback }" value="1">
          <div class="flex flex-col h-48">
            <div
              class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium"
            >
              Content I
            </div>
          </div>
          <div class="flex pt-6 justify-end">
            <Button
              label="Next"
              icon="pi pi-arrow-right"
              iconPos="right"
              @click="activateCallback('2')"
            />
          </div>
        </StepPanel>
        <StepPanel v-slot="{ activateCallback }" value="2">
          <div class="flex flex-col h-48">
            <div
              class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium"
            >
              <div class="ma-4">
                <p class="text-center font-20 font-weight-bold mb-8">Submit Activity Report</p>
                <v-textarea label="content" v-model="initialSalesReportContent" />
                <div class="d-flex justify-end mt-4">
                  <v-btn
                    block
                    @click="submitInitialSalesActivityReport"
                    variant="tonal"
                    :disabled="initialSalesReportContent"
                    >Submit</v-btn
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="flex pt-6 justify-between">
            <Button
              label="Back"
              severity="secondary"
              icon="pi pi-arrow-left"
              @click="activateCallback('1')"
            />
            <Button
              label="Next"
              icon="pi pi-arrow-right"
              iconPos="right"
              @click="activateCallback('3')"
            />
          </div>
        </StepPanel>
        <StepPanel v-slot="{ activateCallback }" value="3">
          <div class="flex flex-col h-48">
            <div
              class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium"
            >
              Content III
            </div>
          </div>
          <div class="pt-6">
            <Button
              label="Back"
              severity="secondary"
              icon="pi pi-arrow-left"
              @click="activateCallback('2')"
            />
          </div>
        </StepPanel>
      </StepPanels>
    </Stepper> -->
  </Dialog>

  <!-- <Dialog v-model:visible="displayInitialReportDialog" style="width: 600px" modal>
    <div class="ma-4">
      <p class="text-center font-20 font-weight-bold mb-8">Submit Initial Activity Report</p>
      <v-textarea label="content" v-model="initialSalesReportContent" />
      <div class="d-flex justify-end mt-4">
        <v-btn
          block
          @click="submitInitialSalesActivityReport"
          variant="tonal"
          :disabled="throttleInitialReportRequest"
          >Submit</v-btn
        >
      </div>
    </div>
  </Dialog>

  <Dialog v-model:visible="displaySalesActivityReportForm" style="width: 600px" modal>
    <v-card>
      <v-card-title class="mt-6 text-center">Submit Sales Activity Report</v-card-title>
      <v-card-text class="mt-4">
        <p class="font-16 mb-2">change customer journey</p>
        <v-select
          :items="customerJourneyList"
          item-title="name"
          return-object
          v-model="customerAssignment.customerJourney"
        />
        <p class="font-16 mt-4 mb-2">describe sales activity</p>
        <SalesActivityReportComponent :sales-activity-report="salesActivityReport" />
      </v-card-text>
      <div class="d-flex justify-center ma-6">
        <v-btn
          block
          @click="submitSalesActivityReport"
          variant="tonal"
          :disabled="!salesActivityReport.isValidToSubmit() && throttleActivityReportRequest"
          >submit</v-btn
        >
      </div>
    </v-card>
  </Dialog>

  <Dialog v-model:visible="displayNextActionDialog" style="width: 600px" modal :closable="false">
    <div class="ma-4">
      <p class="text-center font-20 font-weight-bold mb-8">Plan Next Activity</p>
      <div class="mt-4">
        <v-select label="next step" :items="nextStepItems" v-model="nextStep"></v-select>
        <div v-if="nextStep === nextStepItems[0]">
          <SubmitSalesActivityScheduleComponent :sales-activity-schedule="newActivitySchedule" />
          <div class="d-flex justify-end mt-4">
            <v-btn @click="submitNewSchedule" class="ml-4">Submit</v-btn>
          </div>
        </div>
        <div v-if="nextStep === nextStepItems[1]">
          <ClosingRequestComponent :closing-request="closingRequest" />
          <v-btn @click="submitClosingRequest" class="ml-4">Submit</v-btn>
        </div>
        <div v-if="nextStep === nextStepItems[2]">
          <RecycleRequestComponent :recycle-request="recycleRequest" />
          <v-btn @click="submitRecycleRequest" class="ml-4">Submit</v-btn>
        </div>
      </div>
    </div>
  </Dialog> -->
</template>

<script setup lang="ts">
import { CustomerJourneyType } from "@/company-bc/domain/model/customer-journey";
import { useStringLimiter } from "@/resources/composables/typography";
import CustomerAssignment, {
  CustomerAssignmentType,
} from "@/sales-bc/domain/model/sales/customer-assignment";
import ClosingRequestComponent from "@/sales-bc/domain/model/sales/customer-assignment/ClosingRequestComponent.vue";
import RecycleRequestComponent from "@/sales-bc/domain/model/sales/customer-assignment/RecycleRequestComponent.vue";
import SubmitSalesActivityScheduleComponent from "@/sales-bc/domain/model/sales/customer-assignment/SubmitSalesActivityScheduleComponent.vue";
import ClosingRequest, {
  ClosingRequestType,
} from "@/sales-bc/domain/model/sales/customer-assignment/closing-request";
import RecycleRequest, {
  RecycleRequestType,
} from "@/sales-bc/domain/model/sales/customer-assignment/recycle-request";
import SalesActivityReportComponent from "@/sales-bc/domain/model/sales/customer-assignment/sales-activity-schedule/SalesActivityReportComponent.vue";
import SalesActivityReport, {
  SalesActivityReportType,
} from "@/sales-bc/domain/model/sales/customer-assignment/sales-activity-schedule/sales-activity-report";
import SalesActivitySchedule, {
  SalesActivityScheduleType,
} from "@/sales-bc/domain/model/sales/customer-assignment/salesActivitySchedule";
import { CustomerAssignmentStatus } from "@/shared-bc/domain/enum/customer-assignment-status";
import EmptyDataIllustrationComponent from "@/shared/components/EmptyDataIllustrationComponent.vue";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import Dialog from "primevue/dialog";
import OverlayPanel from "primevue/overlaypanel";
import { onMounted, reactive, ref } from "vue";

const props = defineProps<{ customerAssignment: CustomerAssignment }>();
const { salesRepository, companyUserRepository } = useDependencyInjection();

const customerJourneyList = ref<CustomerJourneyType[]>([]);
onMounted(async () => {
  const response = await companyUserRepository
    .getUser()!
    .executeGraphqlQueryInCompany<{ viewAllActiveCustomerJourney: CustomerJourneyType[] }>({
      operation: "viewAllActiveCustomerJourney",
      variables: {},
      fields: ["id", "initial", "name", "description"],
    });
  customerJourneyList.value = response.viewAllActiveCustomerJourney;
});

const limitString = (string: string | undefined, length: number) => {
  return useStringLimiter(string, length);
};

const op = ref();
const selectedReport = ref<SalesActivityReport>();
const showReportContent = (event: any, salesActivityReport: SalesActivityReport) => {
  op.value.toggle(event);
  selectedReport.value = salesActivityReport;
};

const displayActivityReportDialog = ref<boolean>(false);
const initialSalesReportContent = ref<string>("");
const throttleInitialReportRequest = ref<boolean>(false);
const submitInitialSalesActivityReport = async () => {
  throttleInitialReportRequest.value = true;
  const response = await salesRepository
    .getUser()
    .executeSalesGraphqlMutation<{ submitInitialSalesActivityReport: SalesActivityScheduleType }>({
      operation: "submitInitialSalesActivityReport",
      variables: {
        CustomerAssignment_id: { type: "ID", value: props.customerAssignment.id },
        content: initialSalesReportContent,
      },
      fields: [
        "id",
        "status",
        "createdTime",
        "startTime",
        "endTime",
        { salesActivity: ["id", "duration", "initial", "name"] },
        { salesActivityReport: ["id", "submitTime", "content"] },
      ],
    });
  const submittedActivitySchedule = new SalesActivitySchedule();
  submittedActivitySchedule.load(response.submitInitialSalesActivityReport);
  props.customerAssignment.salesActivitySchedules.unshift(submittedActivitySchedule);
  initialSalesReportContent.value = "";
  displayActivityReportDialog.value = false;
  displayNextActionDialog.value = true;
  throttleInitialReportRequest.value = false;
};

const showActivityReportDialog = (activitySchedule: SalesActivitySchedule) => {
  selectedActivitySchedule = activitySchedule;
  displaySalesActivityReportForm.value = true;
};
const displaySalesActivityReportForm = ref<boolean>(false);
const throttleActivityReportRequest = ref<boolean>(false);
let selectedActivitySchedule = reactive<SalesActivitySchedule>(new SalesActivitySchedule());
const salesActivityReport = reactive<SalesActivityReport>(new SalesActivityReport());
const submitSalesActivityReport = async () => {
  throttleActivityReportRequest.value = true;
  type ResponseType = {
    updateCustomerAssignmentJourney: CustomerAssignmentType;
    submitSalesActivityReport: SalesActivityReportType;
  };
  const response = await salesRepository.getUser().executeSalesGraphqlMutation<ResponseType>([
    {
      operation: "updateCustomerAssignmentJourney",
      variables: {
        id: { type: "ID", required: true, value: props.customerAssignment.id },
        CustomerJourney_id: {
          type: "ID",
          required: true,
          value: props.customerAssignment.customerJourney?.id,
        },
      },
      fields: [{ customerJourney: ["id", "name", "description", "initial"] }],
    },
    {
      operation: "submitSalesActivityReport",
      variables: {
        SalesActivitySchedule_id: {
          type: "ID",
          required: true,
          value: selectedActivitySchedule.id,
        },
        ...salesActivityReport.toGraphqlVariables(),
      },
      fields: ["id", "submitTime", "content", { salesActivitySchedule: ["status"] }],
    },
  ]);
  props.customerAssignment.customerJourney =
    response.updateCustomerAssignmentJourney.customerJourney!;
  salesActivityReport.load(response.submitSalesActivityReport);
  selectedActivitySchedule.salesActivityReport = salesActivityReport;
  displayNextActionDialog.value = true;
  throttleActivityReportRequest.value = false;
  displaySalesActivityReportForm.value = false;
};

const displayNewScheduleDialog = ref<boolean>(false);
const displayNextActionDialog = ref<boolean>(false);
const nextStepItems = ref(["plan next activity", "request closing", "request recycle"]);
const nextStep = ref(nextStepItems.value[0]);
const newActivitySchedule = ref<SalesActivitySchedule>(new SalesActivitySchedule());

const submittingNewSchedule = ref<boolean>(false);
const submitNewSchedule = async () => {
  submittingNewSchedule.value = true;
  const response = await salesRepository
    .getUser()
    .executeSalesGraphqlMutation<{ submitSalesActivitySchedule: SalesActivityScheduleType }>({
      operation: "submitSalesActivitySchedule",
      variables: {
        CustomerAssignment_id: { type: "ID", required: true, value: props.customerAssignment.id },
        ...newActivitySchedule.value.toGraphqlVariables(),
      },
      fields: ["id", "status", "startTime", "endTime", { salesActivity: ["name", "duration"] }],
    });
  const submittedActivitySchedule = new SalesActivitySchedule();
  submittedActivitySchedule.load(response.submitSalesActivitySchedule);
  props.customerAssignment.salesActivitySchedules.unshift(submittedActivitySchedule);
  submittingNewSchedule.value = false;
  displayNewScheduleDialog.value = false;
};

const closingRequest = reactive<ClosingRequest>(new ClosingRequest());
const throttleClosingRequest = ref<boolean>(false);
const submitClosingRequest = async () => {
  throttleClosingRequest.value = true;
  const response = await salesRepository
    .getUser()
    .executeSalesGraphqlMutation<{ submitClosingRequest: ClosingRequestType }>({
      operation: "submitClosingRequest",
      variables: {
        CustomerAssignment_id: { type: "ID", required: true, value: props.customerAssignment.id },
        ...closingRequest.toGraphqlVariables(),
      },
      fields: ["id", "status", "createdTime", "note", "transactionValue"],
    });
  closingRequest.load(response.submitClosingRequest);
  props.customerAssignment.closingRequests.unshift(closingRequest);
  throttleClosingRequest.value = false;
  displayNextActionDialog.value = false;
};

const recycleRequest = reactive<RecycleRequest>(new RecycleRequest());
const throttleRecycleRequest = ref<boolean>(false);
const submitRecycleRequest = async () => {
  throttleRecycleRequest.value = true;
  const response = await salesRepository
    .getUser()
    .executeSalesGraphqlMutation<{ submitRecycleRequest: RecycleRequestType }>({
      operation: "submitRecycleRequest",
      variables: {
        CustomerAssignment_id: { type: "ID", required: true, value: props.customerAssignment.id },
        ...recycleRequest.toGraphqlVariables(),
      },
      fields: ["id", "status", "createdTime", "note"],
    });
  recycleRequest.load(response.submitRecycleRequest);
  props.customerAssignment.recycleRequests.unshift(recycleRequest);
  throttleRecycleRequest.value = false;
  displayNextActionDialog.value = false;
};
</script>

<style scoped></style>
