<template>
  <div class="d-flex justify-space-between align-center">
    <div class="d-flex justify-space-between align-center">
      <p class="mr-4">Page Size</p>
      <v-combobox variant="solo-filled" flat :items="dataPerPage" v-model="offsetLimit.pageSize" hide-details
        density="compact" @update:modelValue="$emit('renewList')"></v-combobox>
    </div>
    <v-pagination :length="offsetLimit.getTotalPage()" :total-visible="4" v-model="offsetLimit.page" density="comfortable"
      variant="text" @update:modelValue="$emit('loadPage')"></v-pagination>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import OffsetLimit from './offset-limit';

const props = defineProps<{ offsetLimit: OffsetLimit }>()
const dataPerPage = reactive([10, 20, 50, 100]);
</script>

<style lang="scss" scoped></style>
