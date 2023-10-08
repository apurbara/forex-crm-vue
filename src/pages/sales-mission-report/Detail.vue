<template>
  <div class="pa-4">
    <div class="d-flex justify-space-around">
      <section>
        <h2>customer info</h2>
        <PersonCardComponent :person="report.customer" style="width: 300px;">
          <template v-slot:subtitle>
            <p>{{ report.customer.email }}</p>
            <p>{{ report.customer.phone }}</p>
            <p>{{ report.customer.location }}</p>
          </template>
        </PersonCardComponent>
      </section>

      <section>
        <h2>sales info</h2>
        <PersonCardComponent :person="report.sales" style="width: 300px;">
          <template v-slot:subtitle>
            <p>{{ report.sales.email }}</p>
            <p>{{ report.sales.phone }}</p>
            <p>{{ report.sales.location }}</p>
          </template>
        </PersonCardComponent>
      </section>
    </div>

    <section class="my-8">
      <h2>Mission Report</h2>
      <section>
        <h3>sales mission</h3>
        <v-text-field disabled label="name" v-model="report.salesMission.name"></v-text-field>
        <v-textarea disabled label="description" v-model="report.salesMission.description"></v-textarea>
      </section>
      <section>
        <h3>Content Detail</h3>
        <p>created time: {{ report.createdTime }}</p>
        <p>last modified time: {{ report.lastModifiedTime }}</p>
      </section>
      <Editor v-model="report.reportDetail" editorStyle="height: 320px" disabled/>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import PersonCardComponent from '@/shared/components/person-card-component.vue';
import Editor from 'primevue/editor';

const props = defineProps<{ salesMissionReportId: string }>()
const report = ref({
  id: 1,
  customer: { id: 1, name: 'customer one', email: 'customerOne@email.org', phone: '09812312312', location: 'Jakarta' },
  sales: { id: 1, name: 'sales one', email: 'salesOne@email.org', phone: '09812312312', location: 'Bandung' },
  salesMission: { id: 1, name: 'customer one', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi semper nunc sit amet tellus posuere lobortis. Vivamus ac metus nisi. Sed hendrerit tellus iaculis nibh tristique dignissim. Donec ut consectetur arcu. Integer vitae sapien sed' },
  reportDetail: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  createdTime: "2023-05-04 16:00:23",
  lastModifiedTime: "2023-05-04: 09:20:12"
})
</script>

<style lang="scss" scoped></style>