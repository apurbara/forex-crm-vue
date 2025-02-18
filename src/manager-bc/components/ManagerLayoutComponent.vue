<template>
  <div class="flex gap-4">
    <div>
      <RouterView />
    </div>
    <div class="w-1/6">
      <Menu :model="managerNavigationItems" />
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
