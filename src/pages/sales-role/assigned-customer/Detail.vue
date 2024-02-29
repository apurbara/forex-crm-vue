<template>
  <div>
    <h1 class="page-title">Assigned Customer Detail</h1>
    <div class="d-flex justify-space-between wrap">
      <div style="min-width: 48%;">
        <section class="page-section ma-2">
          <div class="mb-4">
            <p class="font-20 font-weight-bold text-center">{{ assignedCustomer.customer.name }}</p>
          </div>
          <div class="d-flex align-center justify-start flex-wrap">
            <InfoComponent style="min-width: 40%;"
              :info="{ label: `phone`, value: assignedCustomer.customer.phone, icon: `mdi-phone-classic` }" />
            <InfoComponent style="min-width: 40%;"
              :info="{ label: `email`, value: assignedCustomer.customer.email, icon: `mdi-email-outline` }" />
            <InfoComponent style="min-width: 40%;"
              :info="{ label: `area`, value: assignedCustomer.customer.area.label.name, icon: `mdi-map-marker-outline` }" />
            <InfoComponent style="min-width: 40%;"
              :info="{ label: `journey`, value: assignedCustomer.customerJourney.label.name, icon: `mdi-progress-star` }" />
          </div>

          <div class="mt-4" v-if="canSubmitNewSchedulePlan">
            <v-btn @click="showNewScheduleDialog = true">
              plan new activity</v-btn>
          </div>

          <v-card v-if="upcomingSchedules.length > 0" v-for="(schedule, key) in upcomingSchedules" :key="key"
            class="mx-auto" title="Upcoming Sales Activity" density="compact" variant="tonal">
            <v-card-text>
              <div class="d-flex align-center justify-start flex-wrap">
                <InfoComponent
                  :info="{ label: `time`, value: calculateTimeDiff(schedule.startTime, schedule.endTime), icon: `mdi-clock-time-three-outline` }" />
                <InfoComponent
                  :info="{ label: `activity`, value: schedule.salesActivity.label.name, icon: `mdi-checkbox-marked-circle-plus-outline` }" />
                <InfoComponent style="min-width: 100%;"
                  :info="{ label: `description`, value: schedule.salesActivity.label.description ?? '-', icon: `mdi-note-edit-outline` }" />
              </div>
            </v-card-text>
          </v-card>

          <v-card v-if="pendingClosingRequests.length > 0" v-for="(request, key) in pendingClosingRequests" :key="key"
            class="mx-auto" title="Pending Closing Request" density="compact" variant="tonal">
            <v-card-text>
              <div class="d-flex align-center justify-start flex-wrap">
                <InfoComponent
                  :info="{ label: `submit time`, value: calculateTimeDiff(request.createdTime, request.createdTime), icon: `mdi-clock-time-three-outline` }" />
                <InfoComponent
                  :info="{ label: `transaction value`, value: request.transactionValue, icon: `mdi-checkbox-marked-circle-plus-outline` }" />
                <div class="ma-2">
                  <p class="font-14 font-weight-thin">note</p>
                  <p class="font-16">{{ request.note }}</p>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <v-card v-if="pendingRecycleRequests.length > 0" v-for="(request, key) in pendingRecycleRequests" :key="key"
            class="mx-auto" title="Pending Recycle Request" density="compact" variant="tonal">
            <v-card-text>
              <div class="d-flex align-center justify-start flex-wrap">
                <InfoComponent
                  :info="{ label: `submit time`, value: calculateTimeDiff(request.createdTime, request.createdTime), icon: `mdi-clock-time-three-outline` }" />
                <div class="ma-2">
                  <p class="font-14 font-weight-thin">note</p>
                  <p class="font-16">{{ request.note }}</p>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <ReportableSalesActivitySchedulesComponent :assigned-customer="assignedCustomer" />
        </section>
        <VerificationReportSectionComponent :assigned-customer="assignedCustomer" />
      </div>


      <section class="page-section" style="min-width: 48%;">
        <h2 class="section-title">Score Distribution</h2>
        <div class="card flex justify-content-center">
          <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full md:w-30rem" />
        </div>
      </section>

    </div>

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

  <Dialog v-model:visible="showNewScheduleDialog" style="width: 600px;" modal>
    <div class="ma-4">
      <p class="text-center font-20 font-weight-bold mb-8">Submit New Activity Schedule</p>
      <SubmitSalesActivityScheduleComponent :sales-activity-schedule="newActivitySchedule" />
      <div class="d-flex justify-end mt-4">
        <v-btn block @click="submitNewSchedule" variant="tonal">Submit</v-btn>
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
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { reactive } from 'vue';
import VerificationReportSectionComponent from './detail/VerificationReportSectionComponent.vue';
import SalesActivityScheduleSectionComponent from './detail/SalesActivityScheduleSectionComponent.vue';
import ReportableSalesActivitySchedulesComponent from './detail/ReportableSalesActivitySchedulesComponent.vue';
import SubmitSalesActivityScheduleComponent from '@/domain/model/personnel/manager/sales/assigned-customer/SubmitSalesActivityScheduleComponent.vue';
import Dialog from 'primevue/dialog';
import Chart from 'primevue/chart';
import InfoComponent from '@/shared/components/info-component.vue';
import { useTimeIntervalDifferenceCounter } from '@/resources/composables/typography';
import { computed } from 'vue';

const { httpRequest, userRepository, cache } = useDependencyInjection()

const assignedCustomer = reactive(new AssignedCustomer())
const props = defineProps<{ assignedCustomerId: string }>()

const newActivitySchedule = ref<SalesActivitySchedule>(assignedCustomer.planNewSchedule())
const canSubmitNewSchedulePlan = computed(() => assignedCustomer.canSubmitNewSchedulePlan())
const upcomingSchedules = computed(() => assignedCustomer.upcomingSchedules())
const pastSchedulesWithoutReport = computed(() => assignedCustomer.pastSchedulesWithoutReport())
const pendingClosingRequests = computed(() => assignedCustomer.activeClosingRequest())
const pendingRecycleRequests = computed(() => assignedCustomer.activeRecycleRequest())

onMounted(async () => {
  const customerVerificationResponse = await userRepository.getUser<CompanyUserRoleInterface>()
    .executeGraphqlQueryInCompany<{ customerVerificationList: PaginationResponseType<CustomerVerificationType> }>(httpRequest, {
      operation: "customerVerificationList",
      variables: { filters: { type: "[FilterInput]", value: [{ column: 'CustomerVerification.disabled', value: false }] } },
      fields: CursorPagination.wrapResultFields(["id", "name", "description", "weight", "position"])
    })
  assignedCustomer.customer.registerCustomerVerificationReports(customerVerificationResponse.customerVerificationList.list)

  const cacheData = cache?.pull<AssignedCustomerType>(`assigned-customer-${props.assignedCustomerId}`);
  if (cacheData) {
    assignedCustomer.load(cacheData);
  } else {
    const response = await userRepository?.getUser<SalesRole>()
      .executeSalesGraphqlQuery<{ assignedCustomerDetail: AssignedCustomerType }>(httpRequest, {
        operation: 'assignedCustomerDetail',
        variables: { id: { type: 'ID', required: true, value: props.assignedCustomerId } },
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
            salesActivitySchedules: CursorPagination.wrapResultFields([
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

  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
})

const calculateTimeDiff = (startTime: string, endTime: string) => {
  const { differenceDescription } = useTimeIntervalDifferenceCounter(startTime, endTime)
  return differenceDescription;
}

const showNewScheduleDialog = ref<boolean>(false)
const submitNewSchedule = async () => {
  const response = await userRepository.getUser<SalesRole>()
    .executeSalesGraphqlMutation<{ submitSalesActivitySchedule: SalesActivityScheduleType }>(httpRequest, {
      operation: "submitSalesActivitySchedule",
      variables: {
        AssignedCustomer_id: { type: "ID", required: true, value: assignedCustomer.id },
        ...newActivitySchedule.value.toGraphqlVariables(),
      },
      fields: ["id", "status", "startTime", "endTime", { salesActivity: ["name", "duration"] }]
    })
  const submittedActivitySchedule = assignedCustomer.planNewSchedule();
  submittedActivitySchedule.load(response.submitSalesActivitySchedule)
  assignedCustomer.salesActivitySchedules.push(submittedActivitySchedule)

  showNewScheduleDialog.value = false
}

const chartData = ref();
const chartOptions = ref<Object | undefined>(undefined);

const setChartData = () => {
  const documentStyle = getComputedStyle(document.body);

  return {
    labels: ['A', 'B', 'C'],
    datasets: [
      {
        data: [540, 325, 702],
        backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
        hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
      }
    ]
  };
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');

  return {
    plugins: {
      legend: {
        labels: {
          cutout: '60%',
          color: textColor
        }
      }
    }
  };
};

</script>

<style lang="scss" scoped></style>