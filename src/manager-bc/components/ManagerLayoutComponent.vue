<template>
  <div class="flex gap-8">
    <div class="w-1/5 h-fit p-3 rounded-lg bg-white">
      <PanelMenu :model="managerNavigationItems">
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
    </div>
    <div class="flex-1">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const managerNavigationItems = ref([
  { label: "dashboard", route: "/manager/dashboard", icon: "pi pi-home" },
  {
    label: "customer assignment",
    route: "/manager/customer-assignment",
    icon: "pi pi-address-book",
  },
  { label: "closing request", route: "/manager/closing-request", icon: "pi pi-dollar" },
  { label: "recycle request", route: "/manager/recycle-request", icon: "pi pi-trash" },
]);
</script>

<style scoped></style>
