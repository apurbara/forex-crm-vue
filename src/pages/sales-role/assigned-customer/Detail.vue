<template>
  <div>
    <h1 class="page-title">Assigned Customer Detail</h1>
    <div class="page-section">
      <PersonCardComponent style="width: 25%;" :person="{
        name: assignedCustomer.customer.name,
        bio: `${assignedCustomer.customer.phone} - ${assignedCustomer.customer.email}`
      }">
        <v-chip color="primary">{{ assignedCustomer.customer.area.label.name }}</v-chip>
        <v-chip color="success">{{ assignedCustomer.customerJourney.label.name }}</v-chip>
        <v-chip color="blue">{{ assignedCustomer.status }}</v-chip>
      </PersonCardComponent>

      <div class="mt-4">
        <v-btn @click="showNewScheduleDialog = true" v-if="assignedCustomer.canSubmitNewSchedulePlan()">
          plan new activity</v-btn>
      </div>

      <ItemCardComponent class="mt-4" style="min-height: 150px; width: 300px;"
        v-if="assignedCustomer.upcomingSchedules().length > 0"
        v-for="(schedule, key) in assignedCustomer.upcomingSchedules()" :key="key" :item="{
          name: schedule.salesActivity.label.name,
          description: schedule.salesActivity.label.description
        }">
        <template v-slot>
          <p>{{ schedule.startTime }} - {{ schedule.endTime }}</p>
        </template>
      </ItemCardComponent>

      <ItemCardComponent class="mt-4" style="min-height: 150px; width: 300px;"
        v-if="assignedCustomer.activeClosingRequest().length > 0"
        v-for="(request, key) in assignedCustomer.activeClosingRequest()" :key="key" :item="{
          name: `Pending Closing Request`,
          description: `
            value: ${request.transactionValue}
                                                                                      submit time: ${request.createdTime}
          `
        }">
        <v-chip color="primary">{{ request.status }}</v-chip>
      </ItemCardComponent>

      <ItemCardComponent class="mt-4" style="min-height: 150px; width: 300px;"
        v-if="assignedCustomer.activeRecycleRequest().length > 0"
        v-for="(request, key) in assignedCustomer.activeClosingRequest()" :key="key" :item="{
          name: `Pending Recycle Request`,
          description: `submit time: ${request.createdTime}`
        }">
        <v-chip color="primary">{{ request.status }}</v-chip>
      </ItemCardComponent>

      <ReportableSalesActivitySchedulesComponent :assigned-customer="assignedCustomer" />
    </div>

    <VerificationReportSectionComponent :assigned-customer="assignedCustomer" />

    <SalesActivityScheduleSectionComponent :assigned-customer="assignedCustomer" />

    <div class="page-section" v-if="assignedCustomer.completedClosingRequest.length > 0">
      <h2 class="section-title">Closing Requests History</h2>
      <div class="card-list">
        <v-card class="card-list__item" v-for="(closingRequest, key) in assignedCustomer.completedClosingRequest()">
          <v-card-title>{{ closingRequest.transactionValue }}</v-card-title>
          <v-card-subtitle>{{ closingRequest.note }}</v-card-subtitle>
          <v-card-item>
            <v-chip color="success">{{ closingRequest.status }}</v-chip>
            <p>created time: {{ closingRequest.createdTime }}</p>
          </v-card-item>
        </v-card>
      </div>
    </div>

    <div class="page-section" v-if="assignedCustomer.completedRecycleRequest.length > 0">
      <h2 class="section-title">Recycle Requests History</h2>
      <div class="card-list">
        <v-card class="card-list__item" v-for="(recycleRequest, key) in assignedCustomer.completedRecycleRequest()">
          <v-card-subtitle>{{ recycleRequest.note }}</v-card-subtitle>
          <v-card-item>
            <v-chip color="success">{{ recycleRequest.status }}</v-chip>
            <p>created time: {{ recycleRequest.createdTime }}</p>
          </v-card-item>
        </v-card>
      </div>
    </div>
  </div>

  <Dialog v-model:visible="showNewScheduleDialog" style="width: 600px;" modal dismissable-mask>
    <div class="ma-4">
      <SubmitSalesActivityScheduleComponent :sales-activity-schedule="newActivitySchedule" />
      <div class="d-flex justify-end mt-4">
        <v-btn @click="submitNewSchedule" class="ml-4">Submit</v-btn>
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { CustomerVerificationType } from '@/domain/model/customer-verification';
import AssignedCustomer, { AssignedCustomerType } from '@/domain/model/personnel/manager/sales/assigned-customer';
import SalesActivitySchedule, { SalesActivityScheduleType } from '@/domain/model/personnel/manager/sales/assigned-customer/sales-activity-schedule';
import SalesRole from '@/domain/user-role/personnel/sales-role';
import { CompanyUserRoleInterface } from '@/domain/user-role/role-interfaces';
import { PaginationResponseType } from '@/resources/components/abstract-pagination';
import CursorPagination from '@/resources/components/cursor-pagination';
import PersonCardComponent from '@/shared/components/person-card-component.vue';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { reactive } from 'vue';
import VerificationReportSectionComponent from './detail/VerificationReportSectionComponent.vue';
import SalesActivityScheduleSectionComponent from './detail/SalesActivityScheduleSectionComponent.vue';
import ItemCardComponent from '@/shared/components/item-card-component.vue';
import ReportableSalesActivitySchedulesComponent from './detail/ReportableSalesActivitySchedulesComponent.vue';
import SubmitSalesActivityScheduleComponent from '@/domain/model/personnel/manager/sales/assigned-customer/SubmitSalesActivityScheduleComponent.vue';
import Dialog from 'primevue/dialog';

const { httpRequest, userRepository, cache } = useDependencyInjection()

const assignedCustomer = reactive(new AssignedCustomer())
const props = defineProps<{ assignedCustomerId: string }>()

const newActivitySchedule = ref<SalesActivitySchedule>(assignedCustomer.planNewSchedule())
const showAddNewSchedule = ref<boolean>(false)

onMounted(async () => {

  const customerVerificationResponse = await userRepository.getUser<CompanyUserRoleInterface>()
    .executeGraphqlQueryInCompany<{ customerVerificationList: PaginationResponseType<CustomerVerificationType> }>(httpRequest, {
      operation: "customerVerificationList",
      variables: { filters: { type: "[FilterInput]", value: [{ column: 'CustomerVerification.disabled', value: false }] } },
      fields: CursorPagination.wrapResultFields(["id", "name", "description"])
    })
  assignedCustomer.customer.registerCustomerVerificationReports(customerVerificationResponse.customerVerificationList.list)

  const cacheData = cache?.pull<AssignedCustomerType>(`assigned-customer-${props.assignedCustomerId}`);
  if (cacheData) {
    assignedCustomer.load(cacheData);
  } else {
    const response = await userRepository?.getUser<SalesRole>()
      .executeSalesGraphqlQuery<{ assignedCustomerDetail: AssignedCustomerType }>(httpRequest, {
        operation: 'assignedCustomerDetail',
        variables: { assignedCustomerId: { type: 'ID', required: true, value: props.assignedCustomerId } },
        fields: [
          'id', 'status', 'createdTime',
          { customerJourney: ["id", "name", "description", "initial"] },
          {
            customer: [
              "id", "name", "email", "phone",
              { area: ["name"] },
              { verificationReports: CursorPagination.wrapResultFields(["id", "CustomerVerification_id", "note", "createdTime"]) },
            ]
          },
          {
            schedules: CursorPagination.wrapResultFields([
              "id", "startTime", "endTime", "status",
              { salesActivity: ["name", "description", "duration", "initial", "disabled"] },
              { salesActivityReport: ["id", "submitTime", "content"] },
            ])
          },
          {
            closingRequests: CursorPagination.wrapResultFields(["id", "status", "createdTime", "transactionValue", "note"])
          },
          {
            recycleRequests: CursorPagination.wrapResultFields(["id", "status", "createdTime", "note"])
          },
        ],
      })
    assignedCustomer.load(response.assignedCustomerDetail)
  }
})

const showNewScheduleDialog = ref<boolean>(false)
const submitNewSchedule = async () => {
  const response = await userRepository.getUser<SalesRole>()
    .executeSalesGraphqlMutation<{ assignedCustomer: { submitSalesActivitySchedule: SalesActivityScheduleType } }>(httpRequest, {
      operation: "assignedCustomer",
      variables: { assignedCustomerId: { type: "ID", required: true, value: assignedCustomer.id } },
      fields: [{
        operation: "submitSalesActivitySchedule",
        variables: newActivitySchedule.value.toGraphqlVariables(),
        fields: ["id", "status", "startTime", "endTime", { salesActivity: ["name", "duration"] }]
      }]
    })
  const submittedActivitySchedule = assignedCustomer.planNewSchedule();
  submittedActivitySchedule.load(response.assignedCustomer.submitSalesActivitySchedule)
  assignedCustomer.salesActivitySchedules.push(submittedActivitySchedule)

  showNewScheduleDialog.value = false
}

</script>

<style lang="scss" scoped></style>