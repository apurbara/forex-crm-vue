<template>
  <h1 class="page-title">Sales Metric List</h1>
  <div class="page-section ma-0">
    <v-tabs v-model="tab" fixed-tabs>
      <v-tab value="striker">Striker</v-tab>
      <v-tab value="fact-finder">Fact Finder</v-tab>
      <v-tab value="greeter">Greeter</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item value="striker">
        <ListStrikerMetricTab />
      </v-window-item>
      <v-window-item value="fact-finder">
        <ListFactFinderMetricTab />
      </v-window-item>
      <v-window-item value="greeter">
        <ListGreeterMetricTab />
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ListStrikerMetricTab from './ListStrikerMetricTab.vue';
import ListFactFinderMetricTab from './ListFactFinderMetricTab.vue';
import ListGreeterMetricTab from './ListGreeterMetricTab.vue';

const tab = ref<string>('striker')
</script>

<style scoped></style>