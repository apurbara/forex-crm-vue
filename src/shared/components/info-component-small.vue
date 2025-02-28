<template>
  <div class="d-flex align-center info-container ma-2">
    <div class="icon-container">
      <v-icon class="ma-1" :icon="info.icon" size="large"></v-icon>
    </div>
    <div class="px-2">
      <p class="font-12 font-weight-thin">{{ info.label }}</p>
      <p class="font-14">{{ info.value }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{ info: { label: string, value: string | number, icon?: string } }>()
</script>

<style lang="scss" scoped>
.icon-container {
  border: solid;
  border-radius: 10%;
}
</style>