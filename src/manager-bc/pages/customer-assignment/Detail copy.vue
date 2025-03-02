<template>
  <h1 class="page-title">{{ customerAssignment.customer?.name }}</h1>
  <div class="d-flex flex-wrap">
    <div style="width: 48%">
      <DetailCustomerBioSection :customer-assignment="customerAssignment" />
      <DetailSalesActivityLogSection :customer-assignment="customerAssignment" />
      <DetailClosingRequestLogSection :customer-assignment="customerAssignment" />
      <DetailRecycleRequestLogSectionCopy :customer-assignment="customerAssignment" />
    </div>
    <div style="width: 48%">
      <DetailCustomerVerificationSection :customer-assignment="customerAssignment" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { onMounted, reactive, ref } from "vue";
import DetailCustomerBioSection from "./DetailCustomerBioSection.vue";
import DetailCustomerVerificationSection from "./DetailCustomerVerificationSection.vue";
import DetailSalesActivityLogSection from "./DetailSalesActivityLogSection.vue";
import DetailClosingRequestLogSection from "./DetailClosingRequestLogSection.vue";
import DetailRecycleRequestLogSectionCopy from "./DetailRecycleRequestLogSection copy.vue";
import { CustomerAssignmentType } from "@/manager-bc/domain/model/manager/sales/customer-assignment";

const props = defineProps<{ customerAssignmentId: string }>();
const customerAssignment = ref<CustomerAssignmentType>({});
const { managerRepository } = useDependencyInjection();

onMounted(async () => {
  const response = await managerRepository
    .getUser()
    .executeManagerGraphqlQuery<{ customerAssignmentDetail: CustomerAssignmentType }>({
      operation: "customerAssignmentDetail",
      variables: { id: { type: "ID", required: true, value: props.customerAssignmentId } },
      fields: [
        ...["id", "status", "createdTime"],
        {
          customer: [
            ...["name", "email", "phone"],
            { city: ["id", "name"] },
            {
              verificationReports: [
                ...["id", "note", "CustomerVerification_id"],
                { customerVerification: ["id", "name", "description", "weight"] },
              ],
            },
          ],
        },
        { customerJourney: ["id", "name", "description", "initial"] },
        {
          salesActivitySchedules: [
            ...["id", "startTime", "endTime", "status"],
            { salesActivity: ["name", "description", "duration", "initial", "disabled"] },
            { salesActivityReport: ["id", "submitTime", "content"] },
          ],
        },
        { closingRequests: ["id", "status", "createdTime", "transactionValue", "note", "remark"] },
        { recycleRequests: ["id", "status", "createdTime", "note", "remark"] },
        { customerAssignmentJourneys: ["id", "startTime", "endTime", "CustomerJourney_id"] },
      ],
    });
  customerAssignment.value = response.customerAssignmentDetail;
});
</script>

<style scoped></style>
