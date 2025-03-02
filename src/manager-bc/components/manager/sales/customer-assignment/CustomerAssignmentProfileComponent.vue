<template>
  <ProgressSpinner v-if="fetchingInitialData" />
  <div v-else>
    <div class="flex justify-between align-baseline">
      <h1 class="text-xl font-semibold">{{ customerAssignment.customer?.name }}</h1>
    </div>
    <div class="flex justify-start align-center gap-2 mt-2">
      <Avatar icon="pi pi-filter" class="!bg-amber-200" />
      <p v-if="customerAssignment.CustomerJourney_id" class="text-stone-500">
        {{ customerJourney?.name?.toUpperCase() }}
      </p>
      <p v-else class="text-red-400">N/A</p>
    </div>
    <div class="flex flex-wrap gap-2 text-sm mt-2">
      <div class="flex justify-start align-center gap-2">
        <Avatar shape="circle" icon="pi pi-phone" class="border" />
        <p class="font-semibold">{{ customerAssignment.customer?.phone }}</p>
      </div>
      <div class="flex justify-start align-center gap-2">
        <Avatar shape="circle" icon="pi pi-map-marker" class="border" />
        <p v-if="customerAssignment.customer?.City_id">
          {{ city?.name }}
        </p>
        <p v-else class="text-red-400">N/A</p>
      </div>
      <div class="flex justify-start align-center gap-2">
        <Avatar shape="circle" icon="pi pi-envelope" class="border" />
        <p v-if="customerAssignment.customer?.email">{{ customerAssignment.customer.email }}</p>
        <p v-else class="text-red-400">no email info</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CustomerJourneyType } from "@/company-bc/domain/model/customer-journey";
import { CityType } from "@/company-bc/domain/model/province/city";
import { useCityStore } from "@/company-bc/stores/city-store";
import { useCustomerJourneyStore } from "@/company-bc/stores/customer-journey-store";
import { CustomerAssignmentType } from "@/manager-bc/domain/model/manager/sales/customer-assignment";
import { onMounted, ref } from "vue";

const props = defineProps<{ customerAssignment: CustomerAssignmentType }>();
const cityStore = useCityStore();
const customerJourneyStore = useCustomerJourneyStore();

const city = ref<CityType>();
const customerJourney = ref<CustomerJourneyType>();

const fetchingInitialData = ref(true);
onMounted(async () => {
  city.value = await cityStore.findCityById(props.customerAssignment.customer?.City_id!);
  customerJourney.value = await customerJourneyStore.findCustomerJourneyById(
    props.customerAssignment.CustomerJourney_id!
  );
  fetchingInitialData.value = false;
});
</script>

<style scoped></style>
