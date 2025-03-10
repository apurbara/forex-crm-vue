<template>
  <div class="page-section">
    <div class="flex justify-between align-baseline">
      <h1 class="text-xl font-semibold">{{ customerAssignment.customer?.name }}</h1>
      <Button
        icon="pi pi-cog"
        variant="text"
        severity="secondary"
        @click="displayingEditDialog()"
      />
    </div>
    <div class="flex flex-col gap-2 text-sm mt-3">
      <div class="flex justify-start align-center gap-2">
        <Avatar icon="pi pi-filter" />
        <p v-if="customerAssignment.customerJourney.name">
          {{ customerAssignment.customerJourney.name }}
        </p>
        <p v-else class="text-red-400">N/A: update journey after submit report</p>
      </div>
      <div class="flex justify-start align-center gap-2">
        <Avatar icon="pi pi-phone" />
        <p>{{ customerAssignment.customer.phone }}</p>
        <Button
          icon="pi pi-whatsapp"
          as="a"
          :href="`whatsapp://send/?phone=${customerAssignment.customer.phone}&text=&app_absent=1`"
          target="_blank"
          rel="noopener"
        />
      </div>
      <div class="flex justify-start align-center gap-2">
        <Avatar icon="pi pi-envelope" />
        <p v-if="customerAssignment.customer.email">{{ customerAssignment.customer.email }}</p>
        <p v-else class="text-red-400">no email info</p>
      </div>
      <div class="flex justify-start align-center gap-2">
        <Avatar icon="pi pi-map-marker" />
        <p v-if="customerAssignment.customer.city">{{ customerAssignment.customer.city?.name }}</p>
        <p v-else class="text-red-400">no location info</p>
      </div>
    </div>
  </div>
  <!--  -->
  <Dialog
    class="p-2"
    v-model:visible="displayEditDialog"
    modal
    header="Update Customer Profile"
    :style="{ width: '40rem' }"
  >
    <!-- <span class="text-surface-500 dark:text-surface-400 block mb-8"
      >Update Customer information.</span
    > -->
    <v-text-field
      class="mt-2"
      label="name"
      v-model="customerAssignment.customer.name"
      :rules="[customerAssignment.customer.isValidName()]"
      density="compact"
    />
    <v-text-field
      label="email"
      v-model="customerAssignment.customer.email"
      density="compact"
      :rules="[customerAssignment.customer.isValidEmail()]"
    />
    <v-autocomplete
      label="city"
      variant="outlined"
      :items="cityList"
      density="compact"
      item-title="name"
      return-object
      v-model="customerAssignment.customer.city"
    />
    <div class="d-flex justify-end mb-4">
      <v-btn
        :disabled="!customerAssignment.customer?.isValidProperties()!"
        variant="tonal"
        @click="updateCustomerBio"
        >update</v-btn
      >
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { CityType } from "@/company-bc/domain/model/province/city";
import { useCityStore } from "@/company-bc/stores/city-store";
import CustomerAssignment, {
  CustomerAssignmentType,
} from "@/sales-bc/domain/model/sales/customer-assignment";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { ref } from "vue";

const props = defineProps<{ customerAssignment: CustomerAssignment }>();
const { salesRepository } = useDependencyInjection();
const cityList = ref<CityType[]>([]);

const cityStore = useCityStore();
const displayEditDialog = ref(false);
const displayingEditDialog = async () => {
  cityList.value = await cityStore.fecthAllActiveCityList();
  displayEditDialog.value = true;
};

const updateCustomerBio = async () => {
  const response = await salesRepository
    .getUser()
    .executeSalesGraphqlMutation<{ updateCustomerBio: CustomerAssignmentType }>({
      operation: "updateCustomerBio",
      variables: {
        id: { type: "ID", required: true, value: props.customerAssignment.id },
        customer: {
          type: "CustomerInput",
          value: props.customerAssignment.customer?.toGraphqlVariables(),
        },
      },
      fields: [{ customer: ["name", "email", { city: ["id", "name"] }] }],
    });
  props.customerAssignment.customer?.load(response.updateCustomerBio.customer!);
  displayEditDialog.value = false;
};
</script>

<style scoped></style>
