<template>
  <div class="card-list" v-if="assignedCustomer.pastSchedulesWithoutReport().length > 0">
    <ItemCardComponent class="ma-2" style="min-height: 150px; width: 300px;"
      v-for="(schedule, key) in assignedCustomer.pastSchedulesWithoutReport()" :key="key" :item="{
        name: schedule.salesActivity.label.name,
        description: schedule.salesActivity.label.description
      }">
      <template v-slot>
        <p>{{ schedule.startTime }} - {{ schedule.endTime }}</p>
        <div class="d-flex justify-end">
          <v-btn @click="showSubmitSalesActivityForm(schedule)">report</v-btn>
        </div>
      </template>
    </ItemCardComponent>
  </div>

  <Dialog v-model:visible="displaySalesActivityReportForm" style="width: 800px;" modal dismissable-mask>
    <v-stepper :items="['Submit Report', 'Plan New Schedule Or Conclude']">
      <template v-slot:item.1>
        <div v-if="!!toReportSchedule?.salesActivityReport.id">report submitted</div>
        <div v-else class="mt-4">
          <v-select :items="customerJourneyList" item-title="name" return-object
            @update:model-value="selectCustomerJourney"></v-select>
          <SalesActivityReportComponent :sales-activity-report="toReportSchedule?.salesActivityReport!" />
          <div class="d-flex justify-center">
            <v-btn @click="submitSalesActivityReport"
              :disabled="!toReportSchedule?.salesActivityReport.isValidToSubmit()">submit</v-btn>
          </div>
        </div>
      </template>

      <template v-slot:item.2>
        <div class="mt-4">
          <v-select label="next step" :items="nextStepItems" v-model="nextStep"></v-select>
          <div v-if="nextStep === nextStepItems[0]">
            <SubmitSalesActivityScheduleComponent :sales-activity-schedule="newActivitySchedule" />
            <div class="d-flex justify-end mt-4">
              <v-btn @click="submitNewSchedule" class="ml-4">Submit</v-btn>
            </div>
          </div>
          <div v-if="nextStep === nextStepItems[1]">
            <SubmitClosingRequestComponent :assigned-customer="assignedCustomer" />
          </div>
          <div v-if="nextStep === nextStepItems[2]">
            <SubmitRecycleRequestComponent :assigned-customer="assignedCustomer" />
          </div>
        </div>
      </template>

    </v-stepper>
  </Dialog>
</template>

<script lang="ts" setup>

import { VStepper } from 'vuetify/labs/VStepper'
import Dialog from 'primevue/dialog';

import AssignedCustomer, { AssignedCustomerType } from '@/domain/model/personnel/manager/sales/assigned-customer';
import SubmitSalesActivityScheduleComponent from '@/domain/model/personnel/manager/sales/assigned-customer/SubmitSalesActivityScheduleComponent.vue';
import SalesActivitySchedule, { SalesActivityScheduleType } from '@/domain/model/personnel/manager/sales/assigned-customer/sales-activity-schedule';
import { SalesActivityReportType } from '@/domain/model/personnel/manager/sales/assigned-customer/sales-activity-schedule/sales-activity-report';
import SalesRole from '@/domain/user-role/personnel/sales-role';
import ItemCardComponent from '@/shared/components/item-card-component.vue';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, ref } from 'vue';
import SalesActivityReportComponent from '@/domain/model/personnel/manager/sales/assigned-customer/sales-activity-schedule/SalesActivityReportComponent.vue';
import SubmitClosingRequestComponent from './sales-activity-schedule-section/SubmitClosingRequestComponent.vue';
import SubmitRecycleRequestComponent from './sales-activity-schedule-section/SubmitRecycleRequestComponent.vue';
import { CompanyUserRoleInterface } from '@/domain/user-role/role-interfaces';
import { CustomerJourneyType } from '@/domain/model/customer-journey';

const props = defineProps<{ assignedCustomer: AssignedCustomer }>()
const { httpRequest, userRepository, cache } = useDependencyInjection()
const newActivitySchedule = ref<SalesActivitySchedule>(props.assignedCustomer.planNewSchedule())

const customerJourneyList = ref<CustomerJourneyType[]>([]);
onMounted(async () => {
  const response = await userRepository.getUser<CompanyUserRoleInterface>()
    .executeGraphqlQueryInCompany<{ customerJourneyList: { list: CustomerJourneyType[] } }>(httpRequest, {
      operation: "customerJourneyList",
      variables: { filters: { type: "[FilterInput]", value: [{ column: "CustomerJourney.disabled", value: false }] } },
      fields: [{ list: ["id", "name"] }]
    })
  customerJourneyList.value.push(...response.customerJourneyList.list)
})

const selectCustomerJourney = (customerJourneyData: any) => {
  props.assignedCustomer.customerJourney.load(customerJourneyData)
}

const toReportSchedule = ref<SalesActivitySchedule>();
const displaySalesActivityReportForm = ref<boolean>(false)
const showSubmitSalesActivityForm = (schedule: SalesActivitySchedule) => {
  displaySalesActivityReportForm.value = true;
  toReportSchedule.value = schedule
}

const submitSalesActivityReport = async () => {
  const response = await userRepository.getUser<SalesRole>()
    .executeSalesGraphqlMutation<{ updateJourney: AssignedCustomerType, salesActivitySchedule: { submitReport: SalesActivityReportType } }>(httpRequest, [
      {
        operation: "updateJourney",
        variables: {
          id: { type: "ID", required: true, value: props.assignedCustomer.id },
          customerJourneyId: { type: "ID", required: true, value: props.assignedCustomer.customerJourney.id }
        },
        fields: [{ customerJourney: ['id', 'name', 'description', 'initial'] }]
      },
      {
        operation: "salesActivitySchedule",
        variables: { salesActivityScheduleId: { type: "ID", required: true, value: toReportSchedule.value?.id } },
        fields: [{
          operation: "submitReport",
          variables: toReportSchedule.value?.salesActivityReport.toGraphqlVariables(),
          fields: ["id", "submitTime", "content"],
        }]
      }
    ])
  props.assignedCustomer.customerJourney.load(response.updateJourney.customerJourney!)
  toReportSchedule.value?.salesActivityReport.load(response.salesActivitySchedule.submitReport)
}

const nextStepItems = ref(['plan next activity', 'request closing', 'request recycle'])
const nextStep = ref(nextStepItems.value[0])

const submitNewSchedule = async () => {
  const response = await userRepository.getUser<SalesRole>()
    .executeSalesGraphqlMutation<{ assignedCustomer: { submitSalesActivitySchedule: SalesActivityScheduleType } }>(httpRequest, {
      operation: "assignedCustomer",
      variables: { assignedCustomerId: { type: "ID", required: true, value: props.assignedCustomer.id } },
      fields: [{
        operation: "submitSalesActivitySchedule",
        variables: newActivitySchedule.value.toGraphqlVariables(),
        fields: ["id", "status", "startTime", "endTime", { salesActivity: ["name", "duration"] }]
      }]
    })
  const submittedActivitySchedule = props.assignedCustomer.planNewSchedule();
  submittedActivitySchedule.load(response.assignedCustomer.submitSalesActivitySchedule)
  props.assignedCustomer.salesActivitySchedules.push(submittedActivitySchedule)

  displaySalesActivityReportForm.value = false
}


</script>

<style lang="scss" scoped></style>