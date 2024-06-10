<template>
  <v-textarea label="note" v-model="recycleRequest.note"></v-textarea>
</template>

<script lang="ts" setup>
import RecycleRequest from './recycle-request';

defineProps<{ recycleRequest: RecycleRequest }>()
</script>

<style lang="scss" scoped></style>