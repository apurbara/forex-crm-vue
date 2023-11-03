<template>
  <section class="page-section">
    <h2 class="section-title">Schedules</h2>
    <div class="d-flex justify-end" v-if="!showAddNewSchedule">
      <v-btn @click="showAddNewSchedule = !showAddNewSchedule">New Schedule</v-btn>
    </div>
    <div v-if="showAddNewSchedule">
      <SubmitSalesActivityScheduleComponent :sales-activity-schedule="newActivitySchedule" />
      <div class="d-flex justify-end mt-4">
        <v-btn @click="showAddNewSchedule = !showAddNewSchedule">Cancel</v-btn>
        <v-btn @click="submitNewSchedule" class="ml-4">Submit</v-btn>
      </div>
    </div>
    <div class="card-list">
      <ItemCardComponent class="ma-2" style="min-height: 150px; width: 300px;"
        v-for="(schedule, key) in assignedCustomer.salesActivitySchedules" :key="key" :item="{
          name: schedule.salesActivity.label.name,
          description: schedule.salesActivity.label.description
        }">
        <template v-slot>
          <p>{{ schedule.startTime }} - {{ schedule.endTime }}</p>
          <div class="d-flex justify-end">
            <v-btn v-if="!!schedule.salesActivityReport.id"
              @click="showReportContent($event, schedule.salesActivityReport)">view report</v-btn>
            <v-btn v-else @click="showSubmitSalesActivityForm(schedule)">report</v-btn>
          </div>
        </template>
      </ItemCardComponent>
    </div>
  </section>

  <Dialog v-model:visible="displaySalesActivityReportForm" style="width: 800px;" modal dismissable-mask>
    <v-stepper :items="['Submit Report', 'Plan New Schedule Or Conclude']">
      <template v-slot:item.1>
        <div v-if="!!toReportSchedule?.salesActivityReport.id">report submitted</div>
        <div v-else class="mt-4">
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

  <OverlayPanel ref="op" showCloseIcon style="width: 600px;">
    <div class="pa-4">{{ selectedReport?.content }}</div>
    <div class="pa-4">submit time: {{ selectedReport?.submitTime }}</div>
  </OverlayPanel>
</template>

<script lang="ts" setup>

import { VStepper } from 'vuetify/labs/VStepper'
import OverlayPanel from 'primevue/overlaypanel';
import Dialog from 'primevue/dialog';

import AssignedCustomer from '@/domain/model/personnel/manager/sales/assigned-customer';
import SubmitSalesActivityScheduleComponent from '@/domain/model/personnel/manager/sales/assigned-customer/SubmitSalesActivityScheduleComponent.vue';
import SalesActivitySchedule, { SalesActivityScheduleType } from '@/domain/model/personnel/manager/sales/assigned-customer/sales-activity-schedule';
import SalesActivityReport, { SalesActivityReportType } from '@/domain/model/personnel/manager/sales/assigned-customer/sales-activity-schedule/sales-activity-report';
import SalesRole from '@/domain/user-role/personnel/sales-role';
import ItemCardComponent from '@/shared/components/item-card-component.vue';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { ref } from 'vue';
import ClosingRequestComponent from '@/domain/model/personnel/manager/sales/assigned-customer/ClosingRequestComponent.vue';
import SalesActivityReportComponent from '@/domain/model/personnel/manager/sales/assigned-customer/sales-activity-schedule/SalesActivityReportComponent.vue';
import SubmitSalesActivityReportComponent from './sales-activity-schedule-section/SubmitSalesActivityReportComponent.vue';
import SubmitClosingRequestComponent from './sales-activity-schedule-section/SubmitClosingRequestComponent.vue';
import SubmitRecycleRequestComponent from './sales-activity-schedule-section/SubmitRecycleRequestComponent.vue';

const props = defineProps<{ assignedCustomer: AssignedCustomer }>()
const { httpRequest, userRepository } = useDependencyInjection()
const newActivitySchedule = ref<SalesActivitySchedule>(props.assignedCustomer.planNewSchedule())

const toReportSchedule = ref<SalesActivitySchedule>();
const op = ref()
const selectedReport = ref<SalesActivityReport>()
const showReportContent = (event: any, salesActivityReport: SalesActivityReport) => {
  op.value.toggle(event)
  selectedReport.value = salesActivityReport
}
const submitSalesActivityReport = async () => {
  const response = await userRepository.getUser<SalesRole>()
    .executeSalesGraphqlMutation<{ salesActivitySchedule: { submitReport: SalesActivityReportType } }>(httpRequest, {
      operation: "salesActivitySchedule",
      variables: { salesActivityScheduleId: { type: "ID", required: true, value: toReportSchedule.value?.id } },
      fields: [{
        operation: "submitReport",
        variables: toReportSchedule.value?.salesActivityReport.toGraphqlVariables(),
        fields: ["id", "submitTime", "content"],
      }]
    })
  toReportSchedule.value?.salesActivityReport.load(response.salesActivitySchedule.submitReport)
}

const nextStepItems = ref(['plan next activity', 'request closing', 'request recycle'])
const nextStep = ref(nextStepItems.value[0])

const showAddNewSchedule = ref<boolean>(false)
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

  showAddNewSchedule.value = false
  displaySalesActivityReportForm.value = false
}

const displaySalesActivityReportForm = ref<boolean>(false)
const showSubmitSalesActivityForm = (schedule: SalesActivitySchedule) => {
  displaySalesActivityReportForm.value = true;
  toReportSchedule.value = schedule
}

</script>

<style lang="scss" scoped></style>