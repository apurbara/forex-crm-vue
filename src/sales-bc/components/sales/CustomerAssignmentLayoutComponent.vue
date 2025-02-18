<template>
  <ProgressSpinner v-if="fetchingCustomerAssignment" />
  <div v-else>
    <div class="flex flex-wrap justify-start gap-6">
      <div class="flex-1">
        <div class="flex gap-3 justify-start">
          <Button
            v-for="(item, key) in navigationMenuItems"
            :key="key"
            severity="secondary"
            as="router-link"
            :to="item.route"
            :icon="item.icon"
            :label="item.label"
          />
          <!-- <Menubar :model="navigationMenuItems" class="bg-transparent">
            <template #item="{ item, props }">
              <router-link v-slot="{ href, navigate }" :to="item.route" custom>
                <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                  <span :class="item.icon" />
                  <span>{{ item.label }}</span>
                </a>
              </router-link>
            </template>
          </Menubar> -->
        </div>
        <div class="mt-4">
          <RouterView :key="customerAssignmentId"></RouterView>
        </div>
      </div>
      <Card class="w-1/3 rounded-lg h-fit" style="overflow: hidden">
        <template #header>
          <div class=" bg-slate-200 p-6" style="overflow: hidden">
            <CustomerAssignmentProfileComponent :customer-assignment="customerAssignment!" />
          </div>
        </template>
        <template #content>
          <CustomerAssignmentVerificationReportComponent
            :customer-assignment="customerAssignment!"
          />
        </template>
        <!-- <div class="p-6 bg-slate-300">
        </div>
        <div class="p-6">
        </div> -->
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useCustomerAssignmentStore } from "@/sales-bc/stores/customer-assignment-store";
import CustomerAssignment from "@/sales-bc/domain/model/sales/customer-assignment";
import CustomerAssignmentVerificationReportComponent from "./customer-assignment/CustomerAssignmentVerificationReportComponent.vue";
import CustomerAssignmentProfileComponent from "./customer-assignment/CustomerAssignmentProfileComponent.vue";

const props = defineProps<{ customerAssignmentId: string }>();
const customerAssignmentStore = useCustomerAssignmentStore();
const customerAssignment = ref<CustomerAssignment>();

const fetchingCustomerAssignment = ref(true);
onMounted(async () => {
  customerAssignment.value = await customerAssignmentStore.getCustomerAssignment(
    props.customerAssignmentId
  );
  //
  fetchingCustomerAssignment.value = false;
});

const navigationMenuItems = ref([
  {
    label: "Sales Activity",
    icon: "pi pi-phone",
    route: `/sales/customer-assignment/${props.customerAssignmentId}/sales-activity`,
  },
  {
    label: "Closing Request",
    icon: "pi pi-money-bill",
    route: `/sales/customer-assignment/${props.customerAssignmentId}/closing-request-log`,
  },
  {
    label: "Recycle Request",
    icon: "pi pi-trash",
    route: `/sales/customer-assignment/${props.customerAssignmentId}/recycle-request-log`,
  },
  {
    label: "Journey Log",
    icon: "pi pi-clipboard",
    route: `/sales/customer-assignment/${props.customerAssignmentId}/journey-log`,
  },
]);
</script>

<style scoped></style>
