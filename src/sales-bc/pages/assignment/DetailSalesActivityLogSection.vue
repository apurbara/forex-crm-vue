<template>
  <section class="page-section ma-2">
    <h2 class="section-title">Activity Log</h2>
    <div class="d-flex justify-space-around flex-wrap mb-2">
      <v-btn v-if="customerAssignment.isIdleAssignment()" @click="displayNewScheduleDialog = true">plan new
        activity</v-btn>
      <v-btn v-if="customerAssignment.isNewAssignment()" @click="displayInitialReportDialog = true">submit initial
        report</v-btn>
    </div>
    <v-table v-if="customerAssignment.salesActivitySchedules.length > 0" density="compact" style="width: 100%;"
      class="datatable px-2">
      <thead>
        <tr>
          <th>sales activity</th>
          <th>report note</th>
          <th>time</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(activitySchedule, key) in customerAssignment.salesActivitySchedules"
          :key="activitySchedule.id ?? key">
          <td>{{ activitySchedule.salesActivity?.name }}</td>
          <td v-if="!activitySchedule.salesActivityReport">
            <v-btn size="small" @click="showActivityReportDialog(activitySchedule)">submit report</v-btn>
          </td>
          <td v-else> {{ limitString(activitySchedule.salesActivityReport?.content, 120) }}
            <v-btn v-if="activitySchedule.salesActivityReport?.content?.length! > 120" variant="text"
              icon="mdi-dots-horizontal-circle-outline" size="small"
              @click="showReportContent($event, activitySchedule.salesActivityReport!)"></v-btn>
          </td>
          <td v-if="activitySchedule.salesActivityReport">{{ new
            Date(activitySchedule.salesActivityReport?.submitTime!).toLocaleString() }}</td>
          <td v-else>{{ new Date(activitySchedule.startTime!).toLocaleString() }}</td>
        </tr>
      </tbody>
    </v-table>
  </section>

  <OverlayPanel ref="op" showCloseIcon style="width: 600px;">
    <div class="pa-4">{{ selectedReport?.content }}</div>
  </OverlayPanel>

  <Dialog v-model:visible="displayNewScheduleDialog" style="width: 600px;" modal>
    <div class="ma-4">
      <p class="text-center font-20 font-weight-bold mb-8">Plan new activity</p>
      <SubmitSalesActivityScheduleComponent :sales-activity-schedule="newActivitySchedule" />
      <div class="d-flex justify-end mt-4">
        <v-btn block @click="submitNewSchedule" variant="tonal" :disabled="throttleNewScheduleRequest">Submit</v-btn>
      </div>
    </div>
  </Dialog>

  <Dialog v-model:visible="displayInitialReportDialog" style="width: 600px;" modal>
    <div class="ma-4">
      <p class="text-center font-20 font-weight-bold mb-8">Submit Initial Activity Report</p>
      <v-textarea label="content" v-model="initialSalesReportContent" />
      <div class="d-flex justify-end mt-4">
        <v-btn block @click="submitInitialSalesActivityReport" variant="tonal"
          :disabled="throttleInitialReportRequest">Submit</v-btn>
      </div>
    </div>
  </Dialog>

  <Dialog v-model:visible="displaySalesActivityReportForm" style="width: 600px;" modal>
    <v-card>
      <v-card-title class="mt-6 text-center">Submit Sales Activity Report</v-card-title>
      <v-card-text class="mt-4">
        <p class="font-16 mb-2">change customer journey</p>
        <v-select :items="customerJourneyList" item-title="name" return-object
          v-model="customerAssignment.customerJourney" />
        <p class="font-16 mt-4 mb-2">describe sales activity</p>
        <SalesActivityReportComponent :sales-activity-report="salesActivityReport" />
      </v-card-text>
      <div class="d-flex justify-center ma-6">
        <v-btn block @click="submitSalesActivityReport" variant="tonal"
          :disabled="!salesActivityReport.isValidToSubmit() && throttleActivityReportRequest">submit</v-btn>
      </div>
    </v-card>
  </Dialog>

  <Dialog v-model:visible="displayNextActionDialog" style="width: 600px;" modal :closable="false">
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
  </Dialog>

</template>

<script setup lang="ts">
import { useStringLimiter } from '@/resources/composables/typography';
import { CustomerJourneyType } from '@/sales-bc/domain/dependency-model/customer-journey';
import CustomerAssignment, { CustomerAssignmentType } from '@/sales-bc/domain/model/sales/customer-assignment';
import ClosingRequestComponent from '@/sales-bc/domain/model/sales/customer-assignment/ClosingRequestComponent.vue';
import RecycleRequestComponent from '@/sales-bc/domain/model/sales/customer-assignment/RecycleRequestComponent.vue';
import SubmitSalesActivityScheduleComponent from '@/sales-bc/domain/model/sales/customer-assignment/SubmitSalesActivityScheduleComponent.vue';
import ClosingRequest, { ClosingRequestType } from '@/sales-bc/domain/model/sales/customer-assignment/closing-request';
import RecycleRequest, { RecycleRequestType } from '@/sales-bc/domain/model/sales/customer-assignment/recycle-request';
import SalesActivityReportComponent from '@/sales-bc/domain/model/sales/customer-assignment/sales-activity-schedule/SalesActivityReportComponent.vue';
import SalesActivityReport, { SalesActivityReportType } from '@/sales-bc/domain/model/sales/customer-assignment/sales-activity-schedule/sales-activity-report';
import SalesActivitySchedule, { SalesActivityScheduleType } from '@/sales-bc/domain/model/sales/customer-assignment/salesActivitySchedule';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import Dialog from 'primevue/dialog';
import OverlayPanel from 'primevue/overlaypanel';
import { onMounted, reactive, ref } from 'vue';

const props = defineProps<{ customerAssignment: CustomerAssignment }>();
const { httpRequest, salesRepository, companyUserRepository } = useDependencyInjection()

const customerJourneyList = ref<CustomerJourneyType[]>([]);
onMounted(async () => {
  const response = await companyUserRepository.getUser()
    .executeGraphqlQueryInCompany<{ viewAllActiveCustomerJourney: CustomerJourneyType[] }>(httpRequest, {
      operation: "viewAllActiveCustomerJourney",
      variables: {},
      fields: ["id", "initial", "name", "description"],
    });
  customerJourneyList.value = response.viewAllActiveCustomerJourney;
});

const limitString = (string: string | undefined, length: number) => {
  return useStringLimiter(string, length)
}

const op = ref();
const selectedReport = ref<SalesActivityReport>()
const showReportContent = (event: any, salesActivityReport: SalesActivityReport) => {
  op.value.toggle(event)
  selectedReport.value = salesActivityReport
}

const displayInitialReportDialog = ref<boolean>(false)
const initialSalesReportContent = ref<string>("");
const throttleInitialReportRequest = ref<boolean>(false);
const submitInitialSalesActivityReport = async () => {
  throttleInitialReportRequest.value = true;
  const response = await salesRepository.getUser()
    .executeSalesGraphqlMutation<{ submitInitialSalesActivityReport: SalesActivityScheduleType }>(httpRequest, {
      operation: 'submitInitialSalesActivityReport',
      variables: {
        CustomerAssignment_id: { type: "ID", value: props.customerAssignment.id },
        content: initialSalesReportContent
      },
      fields: [
        "id", "status", "createdTime", "startTime", "endTime",
        { salesActivity: ["id", "duration", "initial", "name"] },
        { salesActivityReport: ["id", "submitTime", "content"] },
      ]
    })
  const submittedActivitySchedule = new SalesActivitySchedule();
  submittedActivitySchedule.load(response.submitInitialSalesActivityReport)
  props.customerAssignment.salesActivitySchedules.unshift(submittedActivitySchedule)
  initialSalesReportContent.value = "";
  displayInitialReportDialog.value = false;
  displayNextActionDialog.value = true;
  throttleInitialReportRequest.value = false;
}

const showActivityReportDialog = (activitySchedule: SalesActivitySchedule) => {
  selectedActivitySchedule = activitySchedule;
  displaySalesActivityReportForm.value = true;
}
const displaySalesActivityReportForm = ref<boolean>(false);
const throttleActivityReportRequest = ref<boolean>(false);
let selectedActivitySchedule = reactive<SalesActivitySchedule>(new SalesActivitySchedule())
const salesActivityReport = reactive<SalesActivityReport>(new SalesActivityReport());
const submitSalesActivityReport = async () => {
  throttleActivityReportRequest.value = true;
  type ResponseType = { updateCustomerAssignmentJourney: CustomerAssignmentType, submitSalesActivityReport: SalesActivityReportType }
  const response = await salesRepository.getUser()
    .executeSalesGraphqlMutation<ResponseType>(httpRequest, [
      {
        operation: "updateCustomerAssignmentJourney",
        variables: {
          id: { type: "ID", required: true, value: props.customerAssignment.id },
          CustomerJourney_id: { type: "ID", required: true, value: props.customerAssignment.customerJourney?.id },
        },
        fields: [{ customerJourney: ['id', 'name', 'description', 'initial'] }]
      },
      {
        operation: "submitSalesActivityReport",
        variables: {
          SalesActivitySchedule_id: { type: "ID", required: true, value: selectedActivitySchedule.id },
          ...salesActivityReport.toGraphqlVariables(),
        },
        fields: ["id", "submitTime", "content", { salesActivitySchedule: ['status'] }],
      }
    ])
  props.customerAssignment.customerJourney = response.updateCustomerAssignmentJourney.customerJourney!
  salesActivityReport.load(response.submitSalesActivityReport);
  selectedActivitySchedule.salesActivityReport = salesActivityReport;
  displayNextActionDialog.value = true;
  throttleActivityReportRequest.value = false;
  displaySalesActivityReportForm.value = false
}

const displayNewScheduleDialog = ref<boolean>(false)
const displayNextActionDialog = ref<boolean>(false);
const nextStepItems = ref(['plan next activity', 'request closing', 'request recycle'])
const nextStep = ref(nextStepItems.value[0])
const newActivitySchedule = ref<SalesActivitySchedule>(new SalesActivitySchedule())
const throttleNewScheduleRequest = ref<boolean>(false)
const submitNewSchedule = async () => {
  throttleNewScheduleRequest.value = true;
  const response = await salesRepository.getUser()
    .executeSalesGraphqlMutation<{ submitSalesActivitySchedule: SalesActivityScheduleType }>(httpRequest, {
      operation: "submitSalesActivitySchedule",
      variables: {
        CustomerAssignment_id: { type: "ID", required: true, value: props.customerAssignment.id },
        ...newActivitySchedule.value.toGraphqlVariables(),
      },
      fields: ["id", "status", "startTime", "endTime", { salesActivity: ["name", "duration"] }]
    })
  const submittedActivitySchedule = new SalesActivitySchedule();
  submittedActivitySchedule.load(response.submitSalesActivitySchedule)
  props.customerAssignment.salesActivitySchedules.unshift(submittedActivitySchedule)
  throttleNewScheduleRequest.value = false;
  displayNewScheduleDialog.value = false;
  displayNextActionDialog.value = false;
}

const closingRequest = reactive<ClosingRequest>(new ClosingRequest())
const throttleClosingRequest = ref<boolean>(false)
const submitClosingRequest = async () => {
  throttleClosingRequest.value = true;
  const response = await salesRepository.getUser()
    .executeSalesGraphqlMutation<{ submitClosingRequest: ClosingRequestType }>(httpRequest, {
      operation: "submitClosingRequest",
      variables: {
        CustomerAssignment_id: { type: "ID", required: true, value: props.customerAssignment.id },
        ...closingRequest.toGraphqlVariables(),
      },
      fields: ["id", 'status', "createdTime", "note", "transactionValue"]
    })
  closingRequest.load(response.submitClosingRequest);
  props.customerAssignment.closingRequests.unshift(closingRequest)
  throttleClosingRequest.value = false;
  displayNextActionDialog.value = false;
}

const recycleRequest = reactive<RecycleRequest>(new RecycleRequest())
const throttleRecycleRequest = ref<boolean>(false)
const submitRecycleRequest = async () => {
  throttleRecycleRequest.value = true;
  const response = await salesRepository.getUser()
    .executeSalesGraphqlMutation<{ submitRecycleRequest: RecycleRequestType }>(httpRequest, {
      operation: "submitRecycleRequest",
      variables: {
        CustomerAssignment_id: { type: "ID", required: true, value: props.customerAssignment.id },
        ...recycleRequest.toGraphqlVariables(),
      },
      fields: ["id", 'status', "createdTime", "note"]
    })
  recycleRequest.load(response.submitRecycleRequest)
  props.customerAssignment.recycleRequests.unshift(recycleRequest)
  throttleRecycleRequest.value = false;
  displayNextActionDialog.value = false;
}

</script>

<style scoped></style>