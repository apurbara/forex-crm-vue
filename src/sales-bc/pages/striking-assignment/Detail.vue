<template>
  <h1 class="page-title">{{ strikingAssignment.customerAssignment.customer.name }}</h1>
  <div class="d-flex flex-wrap">
    <div class="flex-grow-1 flex-shrink-0">
      <section class="page-section ma-2">
        <DetailCustomerVerificationSection :strikingAssignment="strikingAssignment" />
      </section>
    </div>
    <div style="width: 35%;">
      <section class="page-section ma-2">
        <div class="d-flex align-center justify-end mb-4">
          <v-btn variant="tonal" @click="displayUpdateJourneyDialog = true"><v-icon icon="mdi-filter-outline"
              start></v-icon> journey: {{
                strikingAssignment.customerJourney.name }}</v-btn>
        </div>
        <DetailCustomerSection :customer-assignment="strikingAssignment.customerAssignment" />
        <div class="d-flex justify-end">
          <v-btn :disabled="strikingAssignment.hasActiveClosingRequest()"
            @click="displayClosingRequestDialog = true">Request Closing</v-btn>
        </div>
      </section>
    </div>
  </div>
  <div>
    <DetailClosingRequestLogSection :strikingAssignment="strikingAssignment" />
  </div>
  <div>
    <DetailSalesActivityLogSection :customer-assignment="strikingAssignment.customerAssignment" />
  </div>
  <section v-if="greetingAssignmentsHistory.length > 0" class="page-section ma-2">
    <h2 class="section-title">Greeting History</h2>
    <DetailActivityHistorySection :customer-assignments="greetingAssignmentsHistory" />
  </section>
  <section v-if="factFindingAssignmentsHistory.length > 0" class="page-section ma-2">
    <h2 class="section-title">Fact Finding History</h2>
    <DetailActivityHistorySection :customer-assignments="factFindingAssignmentsHistory" />
  </section>

  <Dialog v-model:visible="displayClosingRequestDialog" style="width: 600px;" modal :closable="true">
    <div class="ma-4">
      <p class="text-center font-20 font-weight-bold mb-8">Submit Closing Request</p>
      <div class="mt-4">
        <ClosingRequestComponent :closing-request="closingRequest" />
        <v-btn :disabled="throttleClosingRequest" @click="submitClosingRequest" class="ml-4">Submit</v-btn>
      </div>
    </div>
  </Dialog>

  <Dialog v-model:visible="displayUpdateJourneyDialog" style="width: 600px;" modal :closable="true">
    <div class="ma-4">
      <p class="text-center font-20 font-weight-bold mb-8">Submit Closing Request</p>
      <div class="mt-4">
        <v-select density="compact" :items="customerJourneyList" v-model="newCustomerJourney" return-object
          label="select customer journey" item-title="name"></v-select>
        <v-btn @click="updateJourney" class="ml-4" :disabled="throttleUpdateJourney">update</v-btn>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router'
import DetailCustomerVerificationSection from './DetailCustomerVerificationSection.vue';
import StrikingAssignment from '@/sales-bc/domain/model/sales/striking-assignment';
import { StrikingAssignmentType } from '@/company-bc/domain/model/manager/sales/striking-assignment';
import DetailClosingRequestLogSection from './DetailClosingRequestLogSection.vue';
import DetailSalesActivityLogSection from '../customer-assignment/DetailSalesActivityLogSection.vue';
import DetailCustomerSection from '../customer-assignment/DetailCustomerSection.vue';
import { GreetingAssignmentType } from '@/company-bc/domain/model/manager/sales/greeting-assignment';
import { FactFindingAssignmentType } from '@/company-bc/domain/model/manager/sales/fact-finding-assignment';
import DetailActivityHistorySection from '../customer-assignment/DetailActivityHistorySection.vue';
import ClosingRequestComponent from '@/sales-bc/domain/model/sales/striking-assignment/ClosingRequestComponent.vue';
import ClosingRequest from '@/sales-bc/domain/model/sales/striking-assignment/closing-request';
import { ClosingRequestType } from '@/company-bc/domain/model/manager/sales/striking-assignment/closing-request';
import Dialog from 'primevue/dialog';
import { CustomerJourneyType } from '@/company-bc/domain/model/customer-journey';

const { salesRepository, companyUserRepository } = useDependencyInjection()

const props = defineProps<{ strikingAssignmentId: string }>()
const strikingAssignment = reactive(new StrikingAssignment());
var greetingAssignmentsHistory: GreetingAssignmentType[] = reactive([]);
var factFindingAssignmentsHistory: FactFindingAssignmentType[] = reactive([]);

const router = useRouter()

onMounted(async () => {
  const response = await salesRepository.getUser()
    .executeSalesGraphqlQuery<{ strikingAssignmentDetail: StrikingAssignmentType }>({
      operation: "strikingAssignmentDetail",
      variables: { id: { type: 'ID', required: true, value: props.strikingAssignmentId } },
      fields: [
        'id', 'status', 'createdTime',
        { customerJourney: ["id", "name"] },
        {
          customer: [
            'name', "email", "phone", "rating", "source", "bio",
            { city: ["id", "name"] },
            { verificationReports: ["id", "note", "CustomerVerification_id"] },
            {
              greetingAssignments: [
                "status", "createdTime", "", { sales: ["name"] },
                {
                  salesActivitySchedules: [
                    "startTime", "endTime", "status",
                    { salesActivity: ["name", "description",] },
                    { salesActivityReport: ["submitTime", "content"] },
                  ]
                },
              ]
            },
            {
              factFindingAssignments: [
                "status", "createdTime", { sales: ["name"] },
                {
                  salesActivitySchedules: [
                    "startTime", "endTime", "status",
                    { salesActivity: ["name", "description",] },
                    { salesActivityReport: ["submitTime", "content"] },
                  ]
                },
              ]
            },
          ]
        },
        {
          salesActivitySchedules: [
            "id", "startTime", "endTime", "status",
            { salesActivity: ["name", "description", "duration", "initial", "disabled"] },
            { salesActivityReport: ["id", "submitTime", "content"] },
          ]
        },
        { closingRequests: ["id", "status", "createdTime", "transactionValue", "note", "remark"] },
      ],
    });
  strikingAssignment.load(response.strikingAssignmentDetail);
  greetingAssignmentsHistory = response.strikingAssignmentDetail.customer?.greetingAssignments ?? [];
  factFindingAssignmentsHistory = response.strikingAssignmentDetail.customer?.factFindingAssignments ?? [];

  loadCustomerJourneyList();
})

const customerJourneyList = ref<CustomerJourneyType[]>();
const loadCustomerJourneyList = async () => {
  const response = await companyUserRepository.getUser().executeGraphqlQueryInCompany<{ viewAllActiveCustomerJourney: CustomerJourneyType[] }>({
    operation: "viewAllActiveCustomerJourney",
    variables: {},
    fields: ["id", "name"],
  })
  customerJourneyList.value = response.viewAllActiveCustomerJourney;
  newCustomerJourney.value = strikingAssignment.customerJourney;
}

const displayClosingRequestDialog = ref<boolean>(false);
const closingRequest = reactive<ClosingRequest>(new ClosingRequest())
const throttleClosingRequest = ref<boolean>(false)
const submitClosingRequest = async () => {
  throttleClosingRequest.value = true;
  const response = await salesRepository.getUser()
    .executeSalesGraphqlMutation<{ submitClosingRequest: ClosingRequestType }>({
      operation: "submitClosingRequest",
      variables: {
        StrikingAssignment_id: { type: "ID", required: true, value: strikingAssignment.customerAssignment.id },
        ...closingRequest.toGraphqlVariables(),
      },
      fields: ["id", 'status', "createdTime", "note", "transactionValue"]
    })
  closingRequest.load(response.submitClosingRequest);
  strikingAssignment.closingRequests.unshift(closingRequest)
  throttleClosingRequest.value = false;
  displayClosingRequestDialog.value = false;
}

const displayUpdateJourneyDialog = ref<boolean>(false);
const newCustomerJourney = ref<CustomerJourneyType>()
const throttleUpdateJourney = ref<boolean>(false)
const updateJourney = async () => {
  throttleUpdateJourney.value = true;
  const response = await salesRepository.getUser()
    .executeSalesGraphqlMutation<{ updateJourney: StrikingAssignmentType }>({
      operation: "updateJourney",
      variables: {
        id: { type: "ID", required: true, value: strikingAssignment.customerAssignment.id },
        CustomerJourney_id: { type: "ID", value: newCustomerJourney.value?.id },
      },
      fields: [{ customerJourney: ["id", "name"] }]
    })
  strikingAssignment.customerJourney = response.updateJourney.customerJourney!;
  throttleUpdateJourney.value = false;
  displayUpdateJourneyDialog.value = false;
}

</script>

<style scoped></style>