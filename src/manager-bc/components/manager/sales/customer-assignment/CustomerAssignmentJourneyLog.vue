<template>
  <ProgressSpinner v-if="fetchingInitialData" />
  <div v-else class="page-section">
    <h1 class="text-lg mt-1">Customer Journey Log</h1>
    <DataTable class="text-sm" :value="customerAssignment.customerAssignmentJourneys" size="small" fluid>
      <Column
        :field="
          (customerAssignmentJourney) =>
            new Date(customerAssignmentJourney.startTime).toLocaleString('id-ID')
        "
        header="Start Time"
      />
      <Column
        :field="
          (customerAssignmentJourney) =>
            customerAssignmentJourney.endTime
              ? new Date(customerAssignmentJourney.endTime).toLocaleString('id-ID')
              : 'N/A'
        "
        header="End Time"
      />
      <Column
        :field="
          (customerAssignmentJourney) =>
            customerJourneyList
              .find((el) => el.id === customerAssignmentJourney.CustomerJourney_id)
              ?.name?.toUpperCase()
        "
        header="Journey"
      />
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { CustomerJourneyType } from "@/company-bc/domain/model/customer-journey";
import { useCustomerJourneyStore } from "@/company-bc/stores/customer-journey-store";
import { CustomerAssignmentType } from "@/manager-bc/domain/model/manager/sales/customer-assignment";
import { onMounted, ref } from "vue";
const props = defineProps<{ customerAssignment: CustomerAssignmentType }>();

const customerJourneyStore = useCustomerJourneyStore();
const customerJourneyList = ref<CustomerJourneyType[]>([]);
const fetchingInitialData = ref(true);
onMounted(async () => {
  customerJourneyList.value = await customerJourneyStore.fecthAllCustomerJourneyList();
  fetchingInitialData.value = false;
});
</script>

<style scoped></style>
