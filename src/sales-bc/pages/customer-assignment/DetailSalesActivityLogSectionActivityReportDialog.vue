<template>
  <div>
    <v-btn size="small" @click="displaySalesActivityReportForm = true">submit report</v-btn>

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
  </div>
</template>

<script setup lang="ts">
import { CustomerJourneyType } from '@/company-bc/domain/model/customer-journey';
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
import { onMounted, reactive, ref } from 'vue';

const props = defineProps<{ customerAssignment: CustomerAssignment, salesActivitySchedule: SalesActivitySchedule }>()
const { salesRepository, companyUserRepository } = useDependencyInjection();

const customerJourneyList = ref<CustomerJourneyType[]>([]);
onMounted(async () => {
  const response = await companyUserRepository.getUser()!
    .executeGraphqlQueryInCompany<{ viewAllActiveCustomerJourney: CustomerJourneyType[] }>({
      operation: "viewAllActiveCustomerJourney",
      variables: {},
      fields: ["id", "initial", "name", "description"],
    });
  customerJourneyList.value = response.viewAllActiveCustomerJourney;
});

const displaySalesActivityReportForm = ref<boolean>(false);
const throttleActivityReportRequest = ref<boolean>(false);
const salesActivityReport = reactive<SalesActivityReport>(new SalesActivityReport());
const submitSalesActivityReport = async () => {
  throttleActivityReportRequest.value = true;
  type ResponseType = { updateCustomerAssignmentJourney: CustomerAssignmentType, submitSalesActivityReport: SalesActivityReportType }
  const response = await salesRepository.getUser()
    .executeSalesGraphqlMutation<ResponseType>([
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
          SalesActivitySchedule_id: { type: "ID", required: true, value: props.salesActivitySchedule.id },
          ...salesActivityReport.toGraphqlVariables(),
        },
        fields: ["id", "submitTime", "content", { salesActivitySchedule: ['status'] }],
      }
    ])
  props.customerAssignment.customerJourney = response.updateCustomerAssignmentJourney.customerJourney!
  salesActivityReport.load(response.submitSalesActivityReport);
  // props.salesActivitySchedule.salesActivityReport = salesActivityReport;
  displayNextActionDialog.value = true;
  throttleActivityReportRequest.value = false;
  displaySalesActivityReportForm.value = false
}

const displayNextActionDialog = ref<boolean>(false);
const nextStepItems = ref(['plan next activity', 'request closing', 'request recycle'])
const nextStep = ref(nextStepItems.value[0])
const newActivitySchedule = ref<SalesActivitySchedule>(new SalesActivitySchedule())
const throttleNewScheduleRequest = ref<boolean>(false)
const submitNewSchedule = async () => {
  throttleNewScheduleRequest.value = true;
  const response = await salesRepository.getUser()
    .executeSalesGraphqlMutation<{ submitSalesActivitySchedule: SalesActivityScheduleType }>({
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
  props.salesActivitySchedule.salesActivityReport = salesActivityReport;
  displayNextActionDialog.value = false;
}

const closingRequest = reactive<ClosingRequest>(new ClosingRequest())
const throttleClosingRequest = ref<boolean>(false)
const submitClosingRequest = async () => {
  throttleClosingRequest.value = true;
  const response = await salesRepository.getUser()
    .executeSalesGraphqlMutation<{ submitClosingRequest: ClosingRequestType }>({
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
    .executeSalesGraphqlMutation<{ submitRecycleRequest: RecycleRequestType }>({
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