<template>
  <h1 class="page-title">{{ customerAssignment.customer?.name }}</h1>
  <div class="d-flex flex-wrap">
    <div style="width: 48%;">
      <DetailCustomerBioSection :customer-assignment="customerAssignment" />
      <DetailSalesActivityLogSection :customer-assignment="customerAssignment" />
      <DetailClosingRequestLogSection :customer-assignment="customerAssignment" />
      <DetailRecycleRequestLogSectionCopy :customer-assignment="customerAssignment" />
    </div>
    <div style="width: 48%;">
      <DetailCustomerVerificationSection :customer-assignment="customerAssignment" />
    </div>
  </div>
</template>

<script setup lang="ts">
import CustomerAssignment, { CustomerAssignmentType } from '@/sales-bc/domain/model/sales/customer-assignment';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, reactive } from 'vue';
import DetailCustomerBioSection from './DetailCustomerBioSection.vue';
import DetailCustomerVerificationSection from './DetailCustomerVerificationSection.vue';
import DetailSalesActivityLogSection from './DetailSalesActivityLogSection.vue';
import DetailClosingRequestLogSection from './DetailClosingRequestLogSection.vue';
import DetailRecycleRequestLogSectionCopy from './DetailRecycleRequestLogSection copy.vue';

const props = defineProps<{ customerAssignmentId: string }>()
const customerAssignment = reactive(new CustomerAssignment());
const { salesRepository, httpRequest } = useDependencyInjection()

onMounted(async () => {
  const response = await salesRepository.getUser()
    .executeSalesGraphqlQuery<{ customerAssignmentDetail: CustomerAssignmentType }>({
      operation: "customerAssignmentDetail",
      variables: { id: { type: 'ID', required: true, value: props.customerAssignmentId } },
      fields: [
        'id', 'status', 'createdTime',
        {
          customer: [
            'name', "email", "phone",
            { city: ["id", "name"] },
            { verificationReports: ["id", "note", "CustomerVerification_id"] }
          ]
        },
        { customerJourney: ["id", "name", "description", "initial"] },
        {
          salesActivitySchedules: [
            "id", "startTime", "endTime", "status",
            { salesActivity: ["name", "description", "duration", "initial", "disabled"] },
            { salesActivityReport: ["id", "submitTime", "content"] },
          ]
        },
        { closingRequests: ["id", "status", "createdTime", "transactionValue", "note", "remark"] },
        { recycleRequests: ["id", "status", "createdTime", "note", "remark"] },
      ],
    });
  customerAssignment.load(response.customerAssignmentDetail);
})
</script>

<style scoped></style>