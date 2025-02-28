<template>
  <div class="d-flex justify-space-between">
    <h1 class="page-title">{{ factFindingAssignment?.customer?.name }}</h1>
    <div class="d-flex justify-space-between">
      <div class="mt-2 mr-2">fact finder:</div>
      <h1 class="page-title">{{ factFindingAssignment?.sales?.name }}</h1>
    </div>
  </div>
  <div class="d-flex flex-wrap">
    <div style="width: 68%;">
      <section class="page-section ma-2">
        <DetailCustomerVerificationSection :customer="factFindingAssignment?.customer!" />
      </section>
    </div>
    <div style="width: 30%;">
      <section class="page-section ma-2">
        <DetailCustomerSection :customer="factFindingAssignment?.customer!" />
      </section>
    </div>
  </div>
  <div>
    <DetailSalesActivityLogSection :customer-assignment="factFindingAssignment!" />
  </div>
  <section v-if="factFindingAssignment?.customer?.greetingAssignments?.length ?? 0 > 0" class="page-section ma-2">
    <h2 class="section-title">Greeting History</h2>
    <DetailActivityHistorySection :customer-assignments="factFindingAssignment?.customer?.greetingAssignments!" />
  </section>
</template>

<script setup lang="ts">
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, ref } from 'vue';
import DetailSalesActivityLogSection from '../customer-assignment/DetailSalesActivityLogSection.vue';
import DetailCustomerSection from '../customer-assignment/DetailCustomerSection.vue';
import { FactFindingAssignmentType } from '@/company-bc/domain/model/manager/sales/fact-finding-assignment';
import DetailCustomerVerificationSection from '../customer-assignment/DetailCustomerVerificationSection.vue';
import DetailActivityHistorySection from '../customer-assignment/DetailActivityHistorySection.vue';

const props = defineProps<{ factFindingAssignmentId: string }>()
var factFindingAssignment = ref<FactFindingAssignmentType>();
const { managerRepository } = useDependencyInjection()

onMounted(async () => {
  const response = await managerRepository.getUser()
    .executeManagerGraphqlQuery<{ factFindingAssignmentDetail: FactFindingAssignmentType }>({
      operation: "factFindingAssignmentDetail",
      variables: { id: { type: 'ID', required: true, value: props.factFindingAssignmentId } },
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
  factFindingAssignment.value = response.factFindingAssignmentDetail;
})

</script>

<style scoped></style>