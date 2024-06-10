<template>
  <div>
    <h1 class="page-title">Customer Assignment Detail</h1>
    <div class="d-flex justify-space-between wrap">
      <div style="min-width: 48%;">
        <section class="page-section ma-2">
          <section>
            <div class="d-flex justify-end">
              <v-btn v-if="!editingCustomerBio" variant="text" icon="mdi-cog-outline" size="x-small"
                @click="editCustomerBio()"></v-btn>
              <v-btn v-else variant="text" icon="mdi-close-circle-outline" size="x-small" @click="cancelEdit()"></v-btn>
            </div>
            <p v-if="!editingCustomerBio" class="font-20 font-weight-bold text-center">{{
              customerAssignment.customer.name
            }}</p>
            <v-text-field v-else label="name" v-model="customerAssignment.customer.name"
              :rules="[customerAssignment.customer.isValidName()]" density="compact" />
            <div class="d-flex align-center justify-start flex-wrap">
              <InfoComponentIcon style="min-width: 40%;"
                :info="{ value: customerAssignment.customer.phone, icon: `mdi-phone-classic` }" />
              <InfoComponentIcon style="min-width: 40%;"
                :info="{ value: customerAssignment.customerJourney?.name, icon: `mdi-progress-star` }" />
              <InfoComponentIcon v-if="!editingCustomerBio" style="min-width: 40%;"
                :info="{ value: customerAssignment.customer.email, icon: `mdi-email-outline` }" />
              <div v-else style="min-width: 100%;">
                <v-text-field label="email" v-model="customerAssignment.customer.email"
                  :rules="[customerAssignment.customer.isValidEmail()]" />
              </div>
              <InfoComponentIcon v-if="!editingCustomerBio" style="min-width: 40%;"
                :info="{ value: customerAssignment.customer.area?.name, icon: `mdi-map-marker-outline` }" />
              <div v-else style="min-width: 100%;">
                <v-autocomplete label="area" variant="outlined" :items="areaList" item-title="name" return-object
                  v-model="customerAssignment.customer.area" />
              </div>
            </div>
            <div v-if="editingCustomerBio" class="d-flex justify-end mb-4">
              <v-btn :disabled="!customerAssignment.customer.isValidToRegister()" variant="tonal"
                @click="updateCustomerBio">update</v-btn>
            </div>
          </section>

          <div class="d-flex justify-space-between wrap mt-4">
            <v-btn v-if="canSubmitNewSchedulePlan" @click="showNewScheduleDialog = true">
              plan new activity</v-btn>
            <DetailSubmitInitialActivityReportComponent :customer-assignment="customerAssignment" />
            <!-- <v-btn v-if="customerAssignment.canSubmitInitialReport()" @click="showSubmitInitialActivityDialog = true">
              Submit Initial Activity Report</v-btn> -->
          </div>

          <v-card v-if="upcomingSchedules.length > 0" v-for="(schedule, key) in upcomingSchedules" :key="key"
            class="mx-auto" title="Upcoming Sales Activity" density="compact" variant="tonal">
            <v-card-text>
              <div class="d-flex align-center justify-start flex-wrap">
                <InfoComponentIcon
                  :info="{ value: calculateTimeDiff(schedule.startTime, schedule.endTime), icon: `mdi-clock-time-three-outline` }" />
                <InfoComponentIcon
                  :info="{ value: schedule.salesActivity?.name!, icon: `mdi-checkbox-marked-circle-plus-outline` }" />
                <InfoComponentIcon style="min-width: 100%;"
                  :info="{ value: schedule.salesActivity?.description ?? '-', icon: `mdi-note-edit-outline` }" />
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
          <ReportableSalesActivitySchedulesComponent :customer-assignment="customerAssignment" />
        </section>
        <VerificationReportSectionComponent :customer-assignment="customerAssignment" />
      </div>


      <section class="page-section" style="min-width: 48%;">
        <h2 class="section-title">Score Distribution</h2>
        <div class="card flex justify-content-center">
          <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full md:w-30rem" />
        </div>
      </section>

    </div>

    <SalesActivityScheduleSectionComponent :customer-assignment="customerAssignment" />

    <div class="page-section" v-if="customerAssignment.completedClosingRequest().length > 0">
      <h2 class="section-title">Closing Requests History</h2>
      <div class="card-list">
        <v-card class="card-list__item" v-for="(closingRequest, key) in customerAssignment.completedClosingRequest()">
          <v-card-title>{{ closingRequest.transactionValue }}</v-card-title>
          <v-card-subtitle>{{ closingRequest.note }}</v-card-subtitle>
          <v-card-item>
            <v-chip color="success">{{ closingRequest.status }}</v-chip>
            <p>created time: {{ closingRequest.createdTime }}</p>
          </v-card-item>
        </v-card>
      </div>
    </div>

    <div class="page-section" v-if="customerAssignment.completedRecycleRequest().length > 0">
      <h2 class="section-title">Recycle Requests History</h2>
      <div class="card-list">
        <v-card class="card-list__item" v-for="(recycleRequest, key) in customerAssignment.completedRecycleRequest()">
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

  <Dialog v-model:visible="showSubmitInitialActivityDialog" style="width: 600px;" modal>
    <div class="ma-4">
      <p class="text-center font-20 font-weight-bold mb-8">Submit Initial Activity Report</p>
      <v-textarea label="content" v-model="initialSalesReportContent" />
      <div class="d-flex justify-end mt-4">
        <v-btn block @click="submitInitialSalesActivityReport" variant="tonal">Submit</v-btn>
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { AreaType } from '@/company-bc/domain/model/area-structure/area';
import { PaginationResponseType } from '@/resources/components/abstract-pagination';
import CursorPagination from '@/resources/components/cursor-pagination';
import { useTimeIntervalDifferenceCounter } from '@/resources/composables/typography';
import { CustomerVerificationType } from '@/sales-bc/domain-old/dependency-model/customer-verification';
import CustomerAssignment, { CustomerAssignmentType } from '@/sales-bc/domain-old/model/sales/customer-assignment';
import SalesActivitySchedule, { SalesActivityScheduleType } from '@/sales-bc/domain-old/model/sales/customer-assignment/sales-activity-schedule';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { computed, onMounted, reactive, ref } from 'vue';
import ReportableSalesActivitySchedulesComponent from './detail/ReportableSalesActivitySchedulesComponent.vue';
import VerificationReportSectionComponent from './detail/VerificationReportSectionComponent.vue';
import SalesActivityScheduleSectionComponent from './detail/SalesActivityScheduleSectionComponent.vue';
import InfoComponent from '@/shared/components/info-component.vue';
import InfoComponentIcon from '@/shared/components/info-componentIcon.vue';
import Dialog from 'primevue/dialog';
import Chart from 'primevue/chart';
import SubmitSalesActivityScheduleComponent from '@/sales-bc/domain-old/model/sales/customer-assignment/SubmitSalesActivityScheduleComponent.vue';
import DetailSubmitInitialActivityReportComponent from './detail/DetailSubmitInitialActivityReportComponent.vue';


const { httpRequest, companyUserRepository, salesRepository, cache } = useDependencyInjection()

const customerAssignment = reactive(new CustomerAssignment())
const props = defineProps<{ customerAssignmentId: string }>()

const newActivitySchedule = ref<SalesActivitySchedule>(customerAssignment.planNewSchedule())
const canSubmitNewSchedulePlan = computed(() => customerAssignment.canSubmitNewSchedulePlan())
const upcomingSchedules = computed(() => customerAssignment.upcomingSchedules())
const pastSchedulesWithoutReport = computed(() => customerAssignment.pastSchedulesWithoutReport())
const pendingClosingRequests = computed(() => customerAssignment.activeClosingRequest())
const pendingRecycleRequests = computed(() => customerAssignment.activeRecycleRequest())

onMounted(async () => {
  const customerVerificationResponse = await companyUserRepository.getUser()
    .executeGraphqlQueryInCompany<{ customerVerificationList: PaginationResponseType<CustomerVerificationType> }>(httpRequest, {
      operation: "customerVerificationList",
      variables: { filters: { type: "[FilterInput]", value: [{ column: 'CustomerVerification.disabled', value: false }] } },
      fields: CursorPagination.wrapResultFields(["id", "name", "description", "weight", "position"])
    })
  customerAssignment.customer.registerCustomerVerificationReports(customerVerificationResponse.customerVerificationList.list)

  const cacheData = cache?.pull<CustomerAssignmentType>(`customer-assignment-${props.customerAssignmentId}`);
  if (cacheData) {
    customerAssignment.load(cacheData);
  } else {
    const response = await salesRepository.getUser()
      .executeSalesGraphqlQuery<{ customerAssignmentDetail: CustomerAssignmentType }>(httpRequest, {
        operation: 'customerAssignmentDetail',
        variables: { id: { type: 'ID', required: true, value: props.customerAssignmentId } },
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
            recycleRequests: CursorPagination.wrapResultFields(["id", "status", "createdTime", "concludedTime", "note"])
          },
        ],
      })
    customerAssignment.load(response.customerAssignmentDetail)
  }

  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
})

const editingCustomerBio = ref<boolean>(false);
const areaList = ref<AreaType[]>([]);
const customerSnapValue = ref<string>('');

const editCustomerBio = async () => {
  customerSnapValue.value = JSON.stringify(customerAssignment.customer)
  editingCustomerBio.value = true

  if (areaList.value.length < 1) {
    const response = await companyUserRepository.getUser()
      .executeGraphqlQueryInCompany<{ allAreaList: AreaType[] }>(httpRequest, {
        operation: "allAreaList",
        variables: { filters: { type: "[FilterInput]", value: [{ column: "Area.disabled", value: false }] } },
        fields: ["id", "name"]
      })
    areaList.value.push(...response.allAreaList)
  }
}
// const selectArea = (areaData: any) => { customerAssignment.customer.loadArea(areaData) }
const cancelEdit = () => {
  customerAssignment.customer.load(JSON.parse(customerSnapValue.value))
  editingCustomerBio.value = false
}
const updateCustomerBio = async () => {
  const response = await salesRepository.getUser()
    .executeSalesGraphqlMutation<{ updateCustomerBio: CustomerAssignmentType }>(httpRequest, {
      operation: "updateCustomerBio",
      variables: {
        id: { type: "ID", required: true, value: customerAssignment.id },
        customer: {
          type: "CustomerInput", value: customerAssignment.customer.toGraphqlVariables()
        },
      },
      fields: [{ customer: ["name", "email", { area: ["id", "name"] }] }]
    })
  customerAssignment.customer.load(response.updateCustomerBio.customer!)
  editingCustomerBio.value = false;
}

const calculateTimeDiff = (startTime: string, endTime: string) => {
  const { differenceDescription } = useTimeIntervalDifferenceCounter(startTime, endTime)
  return differenceDescription;
}

const showNewScheduleDialog = ref<boolean>(false)

const submitNewSchedule = async () => {
  const response = await salesRepository.getUser()
    .executeSalesGraphqlMutation<{ submitSalesActivitySchedule: SalesActivityScheduleType }>(httpRequest, {
      operation: "submitSalesActivitySchedule",
      variables: {
        CustomerAssignment_id: { type: "ID", required: true, value: customerAssignment.id },
        ...newActivitySchedule.value.toGraphqlVariables(),
      },
      fields: ["id", "status", "startTime", "endTime", { salesActivity: ["name", "duration"] }]
    })
  const submittedActivitySchedule = customerAssignment.planNewSchedule();
  submittedActivitySchedule.load(response.submitSalesActivitySchedule)
  customerAssignment.salesActivitySchedules.push(submittedActivitySchedule)

  showNewScheduleDialog.value = false
}

const showSubmitInitialActivityDialog = ref<boolean>(false)
const initialSalesReportContent = ref<string>("");
const submitInitialSalesActivityReport = async () => {
  const response = await salesRepository.getUser()
    .executeSalesGraphqlMutation<{ submitInitialSalesActivityReport: SalesActivityScheduleType }>(httpRequest, {
      operation: 'submitInitialSalesActivityReport',
      variables: {
        CustomerAssignment_id: { type: "ID", value: customerAssignment.id },
        content: initialSalesReportContent
      },
      fields: [
        "id", "status", "createdTime", "startTime", "endTime",
        { salesActivity: ["id", "duration", "initial", "name"] },
        { salesActivityReport: ["id", "submitTime", "content"] },
      ]
    })
  initialSalesReportContent.value = "";
  showSubmitInitialActivityDialog.value = false;
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