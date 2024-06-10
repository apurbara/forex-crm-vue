<template>
  <v-card v-for="(schedule, key) in pastSchedulesWithoutReport" :key="key" class="mx-auto"
    title="Submit Sales Activity Report" density="compact" variant="tonal">
    <v-card-text>
      <div class="d-flex align-center justify-start flex-wrap">
        <InfoComponentIcon
          :info="{ value: calculateTimeDiff(schedule.startTime, schedule.endTime), icon: `mdi-clock-time-three-outline` }" />
        <InfoComponentIcon
          :info="{ value: schedule.salesActivity?.name!, icon: `mdi-checkbox-marked-circle-plus-outline` }" />
        <InfoComponentIcon style="min-width: 100%;"
          :info="{ value: schedule.salesActivity?.description ?? '', icon: `mdi-note-edit-outline` }" />
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn block @click="showSubmitSalesActivityForm(schedule)">submit</v-btn>
    </v-card-actions>
  </v-card>

  <v-dialog v-model="displaySalesActivityReportForm" width="600px">
    <v-card>
      <v-card-title class="mt-6 text-center">Submit Sales Activity Report</v-card-title>
      <v-card-text class="mt-4">
        <p class="font-16 mb-2">change customer journey</p>
        <v-select :items="customerJourneyList" item-title="name" return-object
          v-model="customerAssignment.customerJourney" />
        <p class="font-16 mt-4 mb-2">describe sales activity</p>
        <SalesActivityReportComponent :sales-activity-report="toReportSchedule?.salesActivityReport!" />
      </v-card-text>
      <div class="d-flex justify-center ma-6">
        <v-btn block @click="submitSalesActivityReport" variant="tonal"
          :disabled="!toReportSchedule?.salesActivityReport.isValidToSubmit()">submit</v-btn>
      </div>
    </v-card>
  </v-dialog>

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
          <SubmitClosingRequestComponent :customer-assignment="customerAssignment"
            @closing-request-submitted="closeDisplayNextActionDialog()" />
        </div>
        <div v-if="nextStep === nextStepItems[2]">
          <SubmitRecycleRequestComponent :customer-assignment="customerAssignment"
            @recycle-request-submitted="closeDisplayNextActionDialog()" />
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>

import { CustomerJourneyType } from '@/company-bc/domain/model/customer-journey';
import { useTimeIntervalDifferenceCounter } from '@/resources/composables/typography';
import CustomerAssignment, { CustomerAssignmentType } from '@/sales-bc/domain-old/model/sales/customer-assignment';
import SubmitSalesActivityScheduleComponent from '@/sales-bc/domain-old/model/sales/customer-assignment/SubmitSalesActivityScheduleComponent.vue';
import SalesActivitySchedule, { SalesActivityScheduleType } from '@/sales-bc/domain-old/model/sales/customer-assignment/sales-activity-schedule';
import SalesActivityReportComponent from '@/sales-bc/domain-old/model/sales/customer-assignment/sales-activity-schedule/SalesActivityReportComponent.vue';
import { SalesActivityReportType } from '@/sales-bc/domain-old/model/sales/customer-assignment/sales-activity-schedule/sales-activity-report';
import InfoComponent from '@/shared/components/info-component.vue';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import Dialog from 'primevue/dialog';
import { computed, onMounted, ref } from 'vue';
import SubmitClosingRequestComponent from './sales-activity-schedule-section/SubmitClosingRequestComponent.vue';
import SubmitRecycleRequestComponent from './sales-activity-schedule-section/SubmitRecycleRequestComponent.vue';
import InfoComponentIcon from '@/shared/components/info-componentIcon.vue';

const props = defineProps<{ customerAssignment: CustomerAssignment }>()
const { httpRequest, salesRepository, companyUserRepository, cache } = useDependencyInjection()
const newActivitySchedule = ref<SalesActivitySchedule>(props.customerAssignment.planNewSchedule())

const customerJourneyList = ref<CustomerJourneyType[]>([]);
onMounted(async () => {
  const response = await companyUserRepository.getUser()
    .executeGraphqlQueryInCompany<{ customerJourneyList: { list: CustomerJourneyType[] } }>(httpRequest, {
      operation: "customerJourneyList",
      variables: {
        filters: {
          type: "[FilterInput]",
          value: [
            { column: "CustomerJourney.disabled", value: false }
          ]
        }
      },
      fields: [{ list: ["id", "name"] }]
    })
  customerJourneyList.value.push(...response.customerJourneyList.list)
})

// const selectCustomerJourney = (customerJourneyData: any) => {
//   props.customerAssignment.customerJourney.load(customerJourneyData)
// }

const toReportSchedule = ref<SalesActivitySchedule>();
const displaySalesActivityReportForm = ref<boolean>(false)
const displayNextActionDialog = ref<boolean>(false)
const pastSchedulesWithoutReport = computed(() => props.customerAssignment.pastSchedulesWithoutReport())

const showSubmitSalesActivityForm = (schedule: SalesActivitySchedule) => {
  displaySalesActivityReportForm.value = true;
  toReportSchedule.value = schedule
}

const calculateTimeDiff = (startTime: string, endTime: string) => {
  const { differenceDescription } = useTimeIntervalDifferenceCounter(startTime, endTime)
  return differenceDescription;
}

const submitSalesActivityReport = async () => {
  type ResponseType = { updateCustomerAssignmentJourney: CustomerAssignmentType, submitSalesActivityReport: SalesActivityReportType }
  const response = await salesRepository.getUser()
    .executeSalesGraphqlMutation<ResponseType>(httpRequest, [
      {
        operation: "updateCustomerAssignmentJourney",
        variables: {
          id: { type: "ID", required: true, value: props.customerAssignment.id },
          CustomerJourney_id: { type: "ID", required: true, value: props.customerAssignment.customerJourney?.id }
        },
        fields: [{ customerJourney: ['id', 'name', 'description', 'initial'] }]
      },
      {
        operation: "submitSalesActivityReport",
        variables: {
          SalesActivitySchedule_id: { type: "ID", required: true, value: toReportSchedule.value?.id },
          ...toReportSchedule.value?.salesActivityReport.toGraphqlVariables(),
        },
        fields: ["id", "submitTime", "content", { salesActivitySchedule: ['status'] }],
      }
    ])
  props.customerAssignment.customerJourney = response.updateCustomerAssignmentJourney.customerJourney
  toReportSchedule.value?.salesActivityReport.load(response.submitSalesActivityReport)
  displaySalesActivityReportForm.value = false
  displayNextActionDialog.value = true
}

const nextStepItems = ref(['plan next activity', 'request closing', 'request recycle'])
const nextStep = ref(nextStepItems.value[0])

const submitNewSchedule = async () => {
  const response = await salesRepository.getUser()
    .executeSalesGraphqlMutation<{ submitSalesActivitySchedule: SalesActivityScheduleType }>(httpRequest, {
      operation: "submitSalesActivitySchedule",
      variables: {
        CustomerAssignment_id: { type: "ID", required: true, value: props.customerAssignment.id },
        ...newActivitySchedule.value.toGraphqlVariables(),
      },
      fields: ["id", "status", "startTime", "endTime", { salesActivity: ["name", "duration"] }]
      // fields: [{
      //   operation: "submitSalesActivitySchedule",
      //   variables: newActivitySchedule.value.toGraphqlVariables(),
      //   fields: ["id", "status", "startTime", "endTime", { salesActivity: ["name", "duration"] }]
      // }]
    })
  const submittedActivitySchedule = props.customerAssignment.planNewSchedule();
  submittedActivitySchedule.load(response.submitSalesActivitySchedule)
  props.customerAssignment.salesActivitySchedules.push(submittedActivitySchedule)
  displayNextActionDialog.value = false
}

const closeDisplayNextActionDialog = () => {
  console.log('close me')
  displayNextActionDialog.value = false
}

</script>

<style lang="scss" scoped></style>