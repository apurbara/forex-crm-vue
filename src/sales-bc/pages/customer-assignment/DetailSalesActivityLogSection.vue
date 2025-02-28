<template>
  <section class="page-section ma-2">
    <h2 class="section-title">Activity Log</h2>
    <div v-if="customerAssignment.status === CustomerAssignmentStatus.ACTIVE"
      class="d-flex justify-space-around flex-wrap mb-2">
      <v-btn @click="displayNewScheduleDialog = true">create schedule</v-btn>
      <v-btn @click="displayNonScheduleActivityReportDialog = true">submit non scheduled report</v-btn>
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
          <td v-else> {{ limitString(activitySchedule.salesActivityReport?.content, 50) }}
            <v-btn v-if="activitySchedule.salesActivityReport?.content?.length! > 50" variant="text"
              icon="mdi-dots-horizontal-circle-outline" size="small"
              @click="showReportContent($event, activitySchedule.salesActivityReport!)"></v-btn>
          </td>
          <!-- <td v-if="activitySchedule.salesActivityReport">{{ new
            Date(activitySchedule.salesActivityReport?.submitTime!).toLocaleString() }}</td> -->
          <td>{{ new Date(activitySchedule.startTime!).toLocaleString("id-ID") }}</td>
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

  <Dialog v-model:visible="displayNonScheduleActivityReportDialog" style="width: 600px;" modal>
    <div class="ma-4">
      <p class="text-center font-20 font-weight-bold mb-8">Submit Non Scheduled Activity Report</p>
      <v-select label="select activity" :items="salesActivityList" item-title="name" return-object
        v-model="nonScheduledSalesActivity" hide-details />
      <v-textarea label="content" v-model="nonScheduledActivityReportContent" />
      <div class="d-flex justify-end mt-4">
        <v-btn block @click="submitNonScheduledActivityReport" variant="tonal"
        :disabled="throttleInitialReportRequest">Submit</v-btn>
      </div>
    </div>
  </Dialog>
  
  <Dialog v-model:visible="displaySalesActivityReportForm" style="width: 600px;" modal>
    <v-card>
      <v-card-title class="mt-6 text-center">Submit Sales Activity Report</v-card-title>
      <v-card-text class="mt-4">
        <p class="font-16 mt-4 mb-2">describe sales activity</p>
        <SalesActivityReportComponent :sales-activity-report="salesActivityReport" />
      </v-card-text>
      <div class="d-flex justify-center ma-6">
        <v-btn block @click="submitSalesActivityReport" variant="tonal"
          :disabled="!salesActivityReport.isValidToSubmit() && throttleActivityReportRequest">submit</v-btn>
      </div>
    </v-card>
  </Dialog>

</template>

<script setup lang="ts">
import { SalesActivityScheduleType } from '@/company-bc/domain/model/manager/sales/customer-assignment/sales-activity-schedule';
import { SalesActivityReportType } from '@/company-bc/domain/model/manager/sales/customer-assignment/sales-activity-schedule/sales-activity-report';
import { SalesActivityType } from '@/company-bc/domain/model/sales-activity';
import { useStringLimiter } from '@/resources/composables/typography';
import CustomerAssignment from '@/sales-bc/domain/model/sales/customer-assignment';
import SalesActivityReport from '@/sales-bc/domain/model/sales/customer-assignment/sales-activity-schedule/sales-activity-report';
import SalesActivityReportComponent from '@/sales-bc/domain/model/sales/customer-assignment/sales-activity-schedule/SalesActivityReportComponent.vue';
import SalesActivitySchedule from '@/sales-bc/domain/model/sales/customer-assignment/salesActivitySchedule';
import SubmitSalesActivityScheduleComponent from '@/sales-bc/domain/model/sales/customer-assignment/SubmitSalesActivityScheduleComponent.vue';
import { CustomerAssignmentStatus } from '@/shared-bc/domain/enum/customer-assignment-status';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import Dialog from 'primevue/dialog';
import OverlayPanel from 'primevue/overlaypanel';
import { onMounted, reactive, ref } from 'vue';

const props = defineProps<{ customerAssignment: CustomerAssignment }>();
const { salesRepository, companyUserRepository } = useDependencyInjection()
const salesActivityList = ref<SalesActivityType[]>([])

onMounted(async () => {
  const response = await companyUserRepository.getUser()!
    .executeGraphqlQueryInCompany<{ salesActivityList: { list: SalesActivityType[] } }>({
      operation: "salesActivityList",
      variables: { filters: { type: "[FilterInput]", value: [{ column: "SalesActivity.disabled", value: false }] } },
      fields: [{ list: ["id", "name"] }]
    })
  salesActivityList.value.push(...response.salesActivityList.list)
})

const limitString = (string: string | undefined, length: number) => {
  return useStringLimiter(string, length)
}

const op = ref();
const selectedReport = ref<SalesActivityReport>()
const showReportContent = (event: any, salesActivityReport: SalesActivityReport) => {
  op.value.toggle(event)
  selectedReport.value = salesActivityReport
}

const displayNonScheduleActivityReportDialog = ref<boolean>(false)
const nonScheduledActivityReportContent = ref<string>("");
const nonScheduledSalesActivity = ref<SalesActivityType>({});
const throttleInitialReportRequest = ref<boolean>(false);
const submitNonScheduledActivityReport = async () => {
  throttleInitialReportRequest.value = true;
  const response = await salesRepository.getUser()
    .executeSalesGraphqlMutation<{ submitNonScheduledActivityReport: SalesActivityReportType }>({
      operation: 'submitNonScheduledActivityReport',
      variables: {
        CustomerAssignment_id: { type: "ID", value: props.customerAssignment.id },
        SalesActivity_id: { type: "ID", value: nonScheduledSalesActivity.value.id },
        content: nonScheduledActivityReportContent
      },
      fields: [
        "id", "submitTime", "content",
        {
          salesActivitySchedule: [
            "id", "status", "startTime", "endTime",
            { salesActivity: ["id", "name"] },
          ]
        },
      ]
    })
  const submittedActivityReport = new SalesActivityReport();
  submittedActivityReport.load(response.submitNonScheduledActivityReport);
  props.customerAssignment.salesActivitySchedules.unshift(submittedActivityReport.salesActivitySchedule!)
  nonScheduledActivityReportContent.value = "";
  displayNonScheduleActivityReportDialog.value = false;
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
  const response = await salesRepository.getUser()
    .executeSalesGraphqlMutation<{ submitSalesActivityReport: SalesActivityReportType }>(
      {
        operation: "submitSalesActivityReport",
        variables: {
          SalesActivitySchedule_id: { type: "ID", required: true, value: selectedActivitySchedule.id },
          ...salesActivityReport.toGraphqlVariables(),
        },
        fields: ["id", "submitTime", "content", { salesActivitySchedule: ['status'] }],
      }
    )
  salesActivityReport.load(response.submitSalesActivityReport);
  selectedActivitySchedule.salesActivityReport = salesActivityReport;
  throttleActivityReportRequest.value = false;
  displaySalesActivityReportForm.value = false
}

const displayNewScheduleDialog = ref<boolean>(false)
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
  displayNewScheduleDialog.value = false;
}

</script>

<style scoped></style>