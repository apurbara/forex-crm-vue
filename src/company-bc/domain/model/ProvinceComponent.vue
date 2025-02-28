<template>
  <v-text-field label="name" v-model="province.name" :rules="[province.isValidName()]" :readonly="readonly" />
</template>

<script setup lang="ts">
import Province from './province';

defineProps<{ province: Province, readonly?: boolean }>()

</script>

<style scoped></style>