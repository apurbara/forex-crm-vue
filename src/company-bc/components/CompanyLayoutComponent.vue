<template>
  <div class="flex gap-6">
    <div class="w-1/5 p-3 rounded-lg bg-white">
      <PanelMenu :model="companyNavigationItems">
        <template #item="{ item }">
          <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
            <a
              v-ripple
              class="flex items-center cursor-pointer px-4 py-2"
              :href="href"
              @click="navigate"
            >
              <span class="text-xl" :class="item.icon" />
              <span class="ml-2">{{ item.label }}</span>
            </a>
          </router-link>
          <a
            v-else
            v-ripple
            class="flex items-center cursor-pointer px-4 py-2"
            :href="item.url"
            :target="item.target"
          >
            <span :class="item.icon" />
            <span class="ml-2">{{ item.label }}</span>
            <span v-if="item.items" class="pi pi-angle-down text-primary ml-auto" />
          </a>
        </template>
      </PanelMenu>
      <!-- <PanelMenu :model="companyNavigationItems"/> -->
    </div>
    <div class="flex-1">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const companyNavigationItems = ref([
  { label: "Customer", route: "/company/customer", icon: "pi pi-users" },
  {
    label: "Customer Assignment",
    route: "/company/customer-assignment",
    icon: "pi pi-address-book",
  },
  { label: "Manager", route: "/company/manager", icon: "mdi mdi-account-tie-outline" },
  { label: "Sales", route: "/company/sales", icon: "pi pi-user" },
  {
    label: "Customer Verification",
    route: "/company/customer-verification",
    icon: "pi pi-list-check",
  },
  { label: "Customer Journey", route: "/company/customer-journey", icon: "pi pi-filter" },
  { label: "Sales Activity", route: "/company/sales-activity", icon: "pi pi-clock" },
  { label: "Individual Target", route: "/company/common-sales-metric", icon: "pi pi-dollar" },
  { label: "Team Target", route: "/company/company-metric", icon: "pi pi-chart-line" },
  { label: "Sales Rank Config", route: "/company/sales-rank", icon: "pi pi-sort-amount-down" },
  { label: "Metric", route: "/company/sales-performance-metric", icon: "pi pi-chart-bar" },
  { label: "Province", route: "/company/province", icon: "pi pi-map" },
  { label: "City", route: "/company/city", icon: "pi pi-map-marker" },
]);
</script>

<style scoped></style>
