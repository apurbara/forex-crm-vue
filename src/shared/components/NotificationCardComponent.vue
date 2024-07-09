<template>
  <div class="notification-card">
    <div class="notification-card__title">{{ title }}</div>
    <div class="notification-card__value">{{ info }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string, info: string | number }>()
</script>

<style scoped>
.notification-card {
  text-align: center;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
  height: 100px;
  width: 200px;
  background-color: white;
  border: solid lightgray;
  border-radius: 6px;
  padding: 8px 8px 12px 8px;
  cursor: pointer;
}

.notification-card__title {
  font-size: 14px;
  font-weight: bolder;
  min-width: 100px;
  color: darkgray;
}

.notification-card__value {
  font-size: 24px;
  font-weight: bold;
  min-width: 100px;
}
</style>