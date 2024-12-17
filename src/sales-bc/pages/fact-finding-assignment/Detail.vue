<template>
  <h1 class="page-title">{{ factFindingAssignment.customerAssignment.customer.name }}</h1>
  <div class="d-flex flex-wrap">
    <div class="flex-grow-1 flex-shrink-0">
      <section class="page-section ma-2">
        <DetailCustomerVerificationSection :fact-finding-assignment="factFindingAssignment" />
        <div class="ma-2">
          <v-btn variant="tonal" @click="markCustomerVerified" :disabled="processingVerificationRequest">complete
            verification</v-btn>
        </div>
      </section>
    </div>
    <div style="width: 35%;">
      <section class="page-section ma-2">
        <DetailCustomerSection :customer-assignment="factFindingAssignment.customerAssignment" />
      </section>
    </div>
  </div>
  <div>
    <DetailSalesActivityLogSection :customer-assignment="factFindingAssignment.customerAssignment" />
  </div>
  <section v-if="greetingAssignmentsHistory.length > 0" class="page-section ma-2">
    <h2 class="section-title">Greeting History</h2>
    <DetailActivityHistorySection :customer-assignments="greetingAssignmentsHistory" />
  </section>
</template>

<script setup lang="ts">
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router'
import FactFindingAssignment from '@/sales-bc/domain/model/sales/fact-finding-assignment';
import { FactFindingAssignmentType } from '@/company-bc/domain/model/manager/sales/fact-finding-assignment';
import DetailCustomerVerificationSection from './DetailCustomerVerificationSection.vue';
import DetailCustomerSection from '../customer-assignment/DetailCustomerSection.vue';
import DetailSalesActivityLogSection from '../customer-assignment/DetailSalesActivityLogSection.vue';
import DetailActivityHistorySection from '../customer-assignment/DetailActivityHistorySection.vue';
import { GreetingAssignmentType } from '@/company-bc/domain/model/manager/sales/greeting-assignment';

const props = defineProps<{ factFindingAssignmentId: string }>()
const factFindingAssignment = reactive(new FactFindingAssignment());
var greetingAssignmentsHistory: GreetingAssignmentType[] = reactive([]);
const { salesRepository, httpRequest } = useDependencyInjection()

const router = useRouter()
const editingCustomerBio = ref<boolean>(false);

onMounted(async () => {
  const response = await salesRepository.getUser()
    .executeSalesGraphqlQuery<{ factFindingAssignmentDetail: FactFindingAssignmentType }>({
      operation: "factFindingAssignmentDetail",
      variables: { id: { type: 'ID', required: true, value: props.factFindingAssignmentId } },
      fields: [
        'id', 'status', 'createdTime',
        {
          customer: [
            'name', "email", "phone", "rating", "source", "bio",
            { city: ["id", "name"] },
            { verificationReports: ["id", "note", "CustomerVerification_id"] },
            {
              greetingAssignments: [
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
      ],
    });
  factFindingAssignment.load(response.factFindingAssignmentDetail);
  greetingAssignmentsHistory = response.factFindingAssignmentDetail.customer?.greetingAssignments ?? [];
})

const processingVerificationRequest = ref<boolean>(false)
const markCustomerVerified = async () => {
  processingVerificationRequest.value = true;
  const response = await salesRepository.getUser()
    .executeSalesGraphqlMutation<{ validateCustomer: FactFindingAssignmentType }>({
      operation: "markCustomerVerified",
      variables: {
        id: { type: "ID", required: true, value: factFindingAssignment.customerAssignment.id },
      },
      fields: ['status']
    })
  processingVerificationRequest.value = false;
  router.push({ path: '/sales-fact-finding-assignment' })
}

</script>

<style scoped></style>