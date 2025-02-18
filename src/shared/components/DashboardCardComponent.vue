<template>
  <RouterLink :to="targetPath">
    <Card class="w-64 hover:drop-shadow-md hover:scale-105">
      <template #content>
        <div class="flex justify-between gap-4 p-2">
          <div class="flex flex-col gap-2">
            <p class="text-sm text-grey">{{ title }}</p>
            <p class="text-2xl font-semibold">{{ badge }}</p>
          </div>
          <div class="flex size-9 align-center justify-center rounded-lg" :class="iconBgColor">
            <i :class="icon"></i>
          </div>
        </div>
      </template>
    </Card>
  </RouterLink>
</template>

<script setup lang="ts">
defineProps<{
  targetPath: string;
  title: string;
  badge: number;
  icon: string;
  iconBgColor: string;
}>();
</script>

<style scoped></style>
