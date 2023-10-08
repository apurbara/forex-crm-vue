<template>
  <div class="pa-4">
    <div class="mb-4">Submit Sales Mission Report</div>
    <v-select :items="salesMissionList" v-model="salesMissionReport.salesMission" label="Sales Mission" item-title="name"
      return-object style="max-width: 600px;"></v-select>
    <Editor v-model="salesMissionReport.content" editorStyle="height: 320px"></Editor>
    <div class="d-flex justify-center">
      <v-btn>submit</v-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import HttpRequestInterface from '@/domain/http-request-interface';
import UserRepository from '@/domain/user-repository';
import Editor from 'primevue/editor';
import { ref } from 'vue';
import { reactive } from 'vue';
import { inject } from 'vue';

const httpRequest = inject<HttpRequestInterface>('httpRequest')!;
const user = inject<UserRepository>('userRepository')?.getUser()!;

const salesMissionReport = reactive({
  salesMission: undefined,
  content: "",
})

const salesMissionList = ref([
  { id: 1, name: "sales mission one" },
  { id: 2, name: "sales mission two" },
  { id: 3, name: "sales mission three" },
])

</script>

<style lang="scss" scoped></style>