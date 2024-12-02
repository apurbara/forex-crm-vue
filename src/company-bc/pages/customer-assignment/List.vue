<template>
  <h1 class="page-title">Customer Assignment List</h1>
  <div class="page-section ma-0">
    <v-tabs v-model="tab" fixed-tabs>
      <v-tab value="greeting">Greeting</v-tab>
      <v-tab value="fact-finding">Fact Finding</v-tab>
      <v-tab value="striking">Striking</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item value="greeting">
        <ListGreetingAssignmentTab />
      </v-window-item>
      <v-window-item value="fact-finding">
        <ListFactFindingAssignmentTab />
      </v-window-item>
      <v-window-item value="striking">
        <ListStrikingAssignmentTab />
      </v-window-item>
    </v-window>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import ListGreetingAssignmentTab from './ListGreetingAssignmentTab.vue';
import ListFactFindingAssignmentTab from './ListFactFindingAssignmentTab.vue';
import ListStrikingAssignmentTab from './ListStrikingAssignmentTab.vue';

const tab = ref<string>('greeting')

</script>

<style lang="scss" scoped></style>