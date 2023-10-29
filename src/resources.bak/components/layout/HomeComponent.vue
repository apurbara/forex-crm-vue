<template>
  <v-app-bar-title>
    <router-link :to="home.to">
      <v-img :src="home.logo ?? defaultLogo" width="100" />
      <!-- {{ home.title }} -->
    </router-link>
  </v-app-bar-title>
</template>

<script setup lang="ts">
import defaultLogo from "@/assets/logo.png"
import HomeInterface from './home-interface';

const props = defineProps<{ home: HomeInterface }>()

</script>

<style></style>
./menu-item