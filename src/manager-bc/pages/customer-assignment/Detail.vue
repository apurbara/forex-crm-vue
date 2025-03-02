<template>
  <ProgressSpinner v-if="fetchingCustomerAssignment" />
  <div v-else>
    <div class="flex flex-wrap justify-start gap-6">
      <Card class="w-1/3 rounded-lg h-fit" style="overflow: hidden">
        <template #header>
          <div class="bg-slate-200 p-6" style="overflow: hidden">
            <CustomerAssignmentProfileComponent :customer-assignment="customerAssignment!" />
          </div>
        </template>
        <template #content>
          <CustomerAssignmentVerificationReportComponent
            :customer-assignment="customerAssignment!"
          />
        </template>
      </Card>
      <div class="flex-1 flex flex-col gap-6">
        <CustomerAssignmentJourneyLog :customer-assignment="customerAssignment" />
        <CustomerAssignmentClosingRequestLog
          v-if="customerAssignment.closingRequests?.length"
          :customer-assignment="customerAssignment"
        />
        <CustomerAssignmentRecycleRequestLog
          v-if="customerAssignment.recycleRequests?.length"
          :customer-assignment="customerAssignment"
        />
        <CustomerAssignmentSalesActivityLog :customer-assignment="customerAssignment" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { onMounted, ref } from "vue";
import { CustomerAssignmentType } from "@/manager-bc/domain/model/manager/sales/customer-assignment";
import CustomerAssignmentVerificationReportComponent from "@/manager-bc/components/manager/sales/customer-assignment/CustomerAssignmentVerificationReportComponent.vue";
import CustomerAssignmentProfileComponent from "@/manager-bc/components/manager/sales/customer-assignment/CustomerAssignmentProfileComponent.vue";
import CustomerAssignmentClosingRequestLog from "@/manager-bc/components/manager/sales/customer-assignment/CustomerAssignmentClosingRequestLog.vue";
import CustomerAssignmentJourneyLog from "@/manager-bc/components/manager/sales/customer-assignment/CustomerAssignmentJourneyLog.vue";
import CustomerAssignmentRecycleRequestLog from "@/manager-bc/components/manager/sales/customer-assignment/CustomerAssignmentRecycleRequestLog.vue";
import CustomerAssignmentSalesActivityLog from "@/manager-bc/components/manager/sales/customer-assignment/CustomerAssignmentSalesActivityLog.vue";

const props = defineProps<{ customerAssignmentId: string }>();
const customerAssignment = ref<CustomerAssignmentType>({});
const { managerRepository } = useDependencyInjection();

const fetchingCustomerAssignment = ref(true);
onMounted(async () => {
  const response = await managerRepository
    .getUser()
    .executeManagerGraphqlQuery<{ customerAssignmentDetail: CustomerAssignmentType }>({
      operation: "customerAssignmentDetail",
      variables: { id: { type: "ID", required: true, value: props.customerAssignmentId } },
      fields: [
        ...["id", "status", "createdTime", "CustomerJourney_id"],
        {
          customer: [
            ...["name", "email", "phone", "City_id"],
            {
              verificationReports: [
                ...["id", "note", "CustomerVerification_id"],
                { customerVerification: ["id", "name", "description", "weight"] },
              ],
            },
          ],
        },
        // { customerJourney: ["id", "name", "description", "initial"] },
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
  fetchingCustomerAssignment.value = false;
});
</script>

<style scoped></style>
