<template>
  <v-card v-for="(schedule, key) in pastSchedulesWithoutReport" :key="key" class="mx-auto"
    title="Submit Sales Activity Report" density="compact" variant="tonal">
    <v-card-text>
      <div class="d-flex align-center justify-start flex-wrap">
        <InfoComponent
          :info="{ label: `time`, value: calculateTimeDiff(schedule.startTime, schedule.endTime), icon: `mdi-clock-time-three-outline` }" />
        <InfoComponent
          :info="{ label: `activity`, value: schedule.salesActivity.label.name, icon: `mdi-checkbox-marked-circle-plus-outline` }" />
        <InfoComponent style="min-width: 100%;"
          :info="{ label: `description`, value: schedule.salesActivity.label.description ?? '', icon: `mdi-note-edit-outline` }" />
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
          @update:model-value="selectCustomerJourney"></v-select>
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
          <SubmitClosingRequestComponent :assigned-customer="assignedCustomer"
            @closing-request-submitted="displayNextActionDialog = false" />
        </div>
        <div v-if="nextStep === nextStepItems[2]">
          <SubmitRecycleRequestComponent :assigned-customer="assignedCustomer"
            @recycle-request-submitted="displayNextActionDialog = false" />
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>

import Dialog from 'primevue/dialog';

import AssignedCustomer, { AssignedCustomerType } from '@/domain/model/personnel/manager/sales/assigned-customer';
import SubmitSalesActivityScheduleComponent from '@/domain/model/personnel/manager/sales/assigned-customer/SubmitSalesActivityScheduleComponent.vue';
import SalesActivitySchedule, { SalesActivityScheduleType } from '@/domain/model/personnel/manager/sales/assigned-customer/sales-activity-schedule';
import { SalesActivityReportType } from '@/domain/model/personnel/manager/sales/assigned-customer/sales-activity-schedule/sales-activity-report';
import SalesRole from '@/domain/user-role/personnel/sales-role';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, ref } from 'vue';
import SalesActivityReportComponent from '@/domain/model/personnel/manager/sales/assigned-customer/sales-activity-schedule/SalesActivityReportComponent.vue';
import SubmitClosingRequestComponent from './sales-activity-schedule-section/SubmitClosingRequestComponent.vue';
import SubmitRecycleRequestComponent from './sales-activity-schedule-section/SubmitRecycleRequestComponent.vue';
import { CompanyUserRoleInterface } from '@/domain/user-role/role-interfaces';
import { CustomerJourneyType } from '@/domain/model/customer-journey';
import { useTimeIntervalDifferenceCounter } from '@/resources/composables/typography';
import InfoComponent from '@/shared/components/info-component.vue';
import { computed } from 'vue';

const props = defineProps<{ assignedCustomer: AssignedCustomer }>()
const { httpRequest, userRepository, cache } = useDependencyInjection()
const newActivitySchedule = ref<SalesActivitySchedule>(props.assignedCustomer.planNewSchedule())

const customerJourneyList = ref<CustomerJourneyType[]>([]);
onMounted(async () => {
  const response = await userRepository.getUser<CompanyUserRoleInterface>()
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

const selectCustomerJourney = (customerJourneyData: any) => {
  props.assignedCustomer.customerJourney.load(customerJourneyData)
}

const toReportSchedule = ref<SalesActivitySchedule>();
const displaySalesActivityReportForm = ref<boolean>(false)
const displayNextActionDialog = ref<boolean>(false)
const pastSchedulesWithoutReport = computed(() => props.assignedCustomer.pastSchedulesWithoutReport())

const showSubmitSalesActivityForm = (schedule: SalesActivitySchedule) => {
  displaySalesActivityReportForm.value = true;
  toReportSchedule.value = schedule
}

const calculateTimeDiff = (startTime: string, endTime: string) => {
  const { differenceDescription } = useTimeIntervalDifferenceCounter(startTime, endTime)
  return differenceDescription;
}

const submitSalesActivityReport = async () => {
  type ResponseType = { updateAssignedCustomerJourney: AssignedCustomerType, submitSalesActivityReport: SalesActivityReportType }
  const response = await userRepository.getUser<SalesRole>()
    .executeSalesGraphqlMutation<ResponseType>(httpRequest, [
      {
        operation: "updateAssignedCustomerJourney",
        variables: {
          id: { type: "ID", required: true, value: props.assignedCustomer.id },
          CustomerJourney_id: { type: "ID", required: true, value: props.assignedCustomer.customerJourney.id }
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
  props.assignedCustomer.customerJourney.load(response.updateAssignedCustomerJourney.customerJourney!)
  toReportSchedule.value?.salesActivityReport.load(response.submitSalesActivityReport)
  displaySalesActivityReportForm.value = false
  displayNextActionDialog.value = true
}

const nextStepItems = ref(['plan next activity', 'request closing', 'request recycle'])
const nextStep = ref(nextStepItems.value[0])

const submitNewSchedule = async () => {
  const response = await userRepository.getUser<SalesRole>()
    .executeSalesGraphqlMutation<{ submitSalesActivitySchedule: SalesActivityScheduleType }>(httpRequest, {
      operation: "submitSalesActivitySchedule",
      variables: {
        AssignedCustomer_id: { type: "ID", required: true, value: props.assignedCustomer.id },
        ...newActivitySchedule.value.toGraphqlVariables(),
      },
      fields: ["id", "status", "startTime", "endTime", { salesActivity: ["name", "duration"] }]
      // fields: [{
      //   operation: "submitSalesActivitySchedule",
      //   variables: newActivitySchedule.value.toGraphqlVariables(),
      //   fields: ["id", "status", "startTime", "endTime", { salesActivity: ["name", "duration"] }]
      // }]
    })
  const submittedActivitySchedule = props.assignedCustomer.planNewSchedule();
  submittedActivitySchedule.load(response.submitSalesActivitySchedule)
  props.assignedCustomer.salesActivitySchedules.push(submittedActivitySchedule)
  displayNextActionDialog.value = false
}

</script>

<style lang="scss" scoped></style>