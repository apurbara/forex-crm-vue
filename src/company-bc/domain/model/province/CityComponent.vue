<template>
  <v-text-field label="name" v-model="city.name" :rules="[city.isValidName()]" :readonly="readonly" />
</template>

<script setup lang="ts">
import City from './city';

defineProps<{ city: City, readonly?: boolean }>()

</script>

<style scoped></style>