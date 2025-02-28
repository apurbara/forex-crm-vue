<template>
  <div class="d-flex justify-space-between">
    <h1 class="page-title">{{ strikingAssignment?.customer?.name }}</h1>
    <div class="d-flex justify-space-between">
      <div class="mt-2 mr-2">striker:</div>
      <h1 class="page-title">{{ strikingAssignment?.sales?.name }}</h1>
    </div>
  </div>
  <div class="d-flex flex-wrap">
    <div style="width: 68%;">
      <section class="page-section ma-2">
        <DetailCustomerVerificationSection :customer="strikingAssignment?.customer!" />
      </section>
    </div>
    <div style="width: 30%;">
      <section class="page-section ma-2">
        <DetailCustomerSection :customer="strikingAssignment?.customer!" />
      </section>
    </div>
  </div>
  <div>
    <DetailClosingRequestLogSection :strikingAssignment="strikingAssignment!" />
  </div>
  <div>
    <DetailSalesActivityLogSection :customer-assignment="strikingAssignment!" />
  </div>
  <section v-if="strikingAssignment?.customer?.greetingAssignments?.length ?? 0 > 0" class="page-section ma-2">
    <h2 class="section-title">Greeting History</h2>
    <DetailActivityHistorySection :customer-assignments="strikingAssignment?.customer?.greetingAssignments!" />
  </section>
  <section v-if="strikingAssignment?.customer?.factFindingAssignments?.length ?? 0 > 0" class="page-section ma-2">
    <h2 class="section-title">Fact Finding History</h2>
    <DetailActivityHistorySection :customer-assignments="strikingAssignment?.customer?.factFindingAssignments!" />
  </section>
</template>

<script setup lang="ts">
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, ref } from 'vue';
import DetailSalesActivityLogSection from '../customer-assignment/DetailSalesActivityLogSection.vue';
import DetailCustomerSection from '../customer-assignment/DetailCustomerSection.vue';
import DetailCustomerVerificationSection from '../customer-assignment/DetailCustomerVerificationSection.vue';
import DetailActivityHistorySection from '../customer-assignment/DetailActivityHistorySection.vue';
import { StrikingAssignmentType } from '@/company-bc/domain/model/manager/sales/striking-assignment';
import DetailClosingRequestLogSection from './DetailClosingRequestLogSection.vue';

const props = defineProps<{ strikingAssignmentId: string }>()
var strikingAssignment = ref<StrikingAssignmentType>();
const { managerRepository } = useDependencyInjection()

onMounted(async () => {
  const response = await managerRepository.getUser()
    .executeManagerGraphqlQuery<{ strikingAssignmentDetail: StrikingAssignmentType }>({
      operation: "strikingAssignmentDetail",
      variables: { id: { type: 'ID', required: true, value: props.strikingAssignmentId } },
      fields: [
        'id', 'status', 'createdTime',
        { sales: ["name"] },
        {
          customer: [
            'name', "email", "phone", "rating", "source",
            { city: ["id", "name"] },
            { verificationReports: ["id", "note", { customerVerification: ["name", "weight"] }] },
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
        { closingRequests: ["id", "status", "createdTime", "transactionValue", "note", "remark"] }
      ],
    });
  strikingAssignment.value = response.strikingAssignmentDetail;
})

</script>

<style scoped></style>