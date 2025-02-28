<template>
  <div class="d-flex align-center info-container ma-2">
    <div class="icon-container">
      <!-- <div style="border: solid; border-radius: 10%"> -->
      <v-icon class="ma-2" :icon="info.icon" size="large"></v-icon>
    </div>
    <div class="px-2">
      <p class="font-14 font-weight-thin text-medium-emphasis">{{ info.label }}</p>
      <p class="font-16 font-weight-medium text-high-emphasis">{{ info.value }}</p>
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