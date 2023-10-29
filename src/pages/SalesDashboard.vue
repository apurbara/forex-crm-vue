<template>
  <div>
    <section>
      <h2>Target Realization</h2>
      <div>
        <v-progress-linear model-value="45" color="light-green" height="25">
          <template v-slot:default="{ value }">
            <strong>45 / 100</strong>
          </template>
        </v-progress-linear>
      </div>
    </section>

    <section class="my-8">
      <h2>Agenda</h2>
      <div class="d-flex justify-space-between">
        <section class="pa-2" style="min-width: 50%;">
          <h3>Upcoming Agenda</h3>
          <v-card v-for="(upcomingMission, key) in upcomingMissions" :key="upcomingMission.id ?? key"
            class="d-flex justify-space-between align-center my-1 px-1"
            :to="`/customer-summary/${upcomingMission.managedCustomer.customer.id}`">
            <div class="d-flex justify-start align-center">
              <v-avatar size="50" class="avatar-center mr-4" :image="'https://i.pravatar.cc/100'" />
              <v-card-title class="flex-grow-0 flex-shrink-0" style="width: 200px;">
                <p>{{ upcomingMission.managedCustomer.customer.name }}</p>
                <v-chip>{{ upcomingMission.managedCustomer.customer.priority }}</v-chip>
                <v-chip>{{ upcomingMission.managedCustomer.customer.status }}</v-chip>
              </v-card-title>
              <v-card-subtitle class="flex-grow-1 flex-shrink-1" style="min-width: 200px;">{{
                limitString(upcomingMission.description, 30) }}</v-card-subtitle>
            </div>
            <v-card-text class="flex-grow-0 flex-shrink-0" style="min-width: 100px;">{{ upcomingMission.startTime
            }}</v-card-text>
          </v-card>
        </section>
        <section class="pa-2" style="min-width: 50%;">
          <h3>Neglected Agenda</h3>
          <v-card v-for="(neglectedMission, key) in pastMissions" :key="neglectedMission.id ?? key"
            class="d-flex justify-space-between align-center my-1 px-1"
            :to="`/customer-summary/${neglectedMission.managedCustomer.customer.id}`">
            <div class="d-flex justify-start align-center">
              <v-avatar size="50" class="avatar-center mr-4" :image="'https://i.pravatar.cc/100'" />
              <v-card-title class="flex-grow-0 flex-shrink-0" style="width: 200px;">
                <p>{{ neglectedMission.managedCustomer.customer.name }}</p>
                <v-chip>{{ neglectedMission.managedCustomer.customer.priority }}</v-chip>
                <v-chip>{{ neglectedMission.managedCustomer.customer.status }}</v-chip>
              </v-card-title>
              <v-card-subtitle class="flex-grow-1 flex-shrink-1" style="min-width: 200px;">{{
                limitString(neglectedMission.description, 30) }}</v-card-subtitle>
            </div>
            <v-card-text class="flex-grow-0 flex-shrink-0" style="min-width: 100px;">{{ neglectedMission.startTime
            }}</v-card-text>
          </v-card>
        </section>
      </div>
    </section>

    <section>
      <h2>Schedule</h2>
      <div>
        <pro-calendar />
        <!-- <pro-calendar :loading="false" view="month" @calendarClosed="void 0"
          @fetchEvents="void 0" /> -->
      </div>
    </section>

    <section class="my-8">
      <h2>Last Sales Mission Report</h2>
      <v-table>
        <thead>
          <tr>
            <th>customer</th>
            <th>sales mission</th>
            <th>submit time</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(report, key) in lastSalesMissionReport" :key="report.id ?? key"
            @click="$router.push(`/sales-mission-report/${report.id}`)" style="cursor: pointer;">
            <td>{{ report.customer.name }}</td>
            <td>{{ report.salesMission.name }}</td>
            <td>{{ report.submitTime }}</td>
          </tr>
        </tbody>
      </v-table>
    </section>
  </div>
</template>

<script lang="ts" setup>
import "vue-pro-calendar/style";
import PersonCardComponent from '@/shared/components/person-card-component.vue';
import { ref } from 'vue';
import { useStringLimiter } from "@/resources/composables/typography";

const upcomingMissions = ref([
  { id: 1, managedCustomer: { id: 1, customer: { id: 1, name: 'customer one', location: 'Bandung', priority: "high", status: "new" } }, startTime: "2023-10-05 15:00:00", endTime: "2023-10-05 16:00:00", type: "call", description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin pretium cursus nulla at lacinia. Fusce egestas egestas vulputate. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque pulvinar commodo justo ac luctus. Nullam quis semper.' },
  { id: 2, managedCustomer: { id: 2, customer: { id: 2, name: 'customer two', location: 'Jakarta', priority: "medium", status: "follow up" } }, startTime: "2023-10-05 16:00:00", endTime: "2023-10-05 17:00:00", type: "meeting", description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin pretium cursus nulla at lacinia. Fusce egestas egestas vulputate. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque pulvinar commodo justo ac luctus. Nullam quis semper.' },
  { id: 3, managedCustomer: { id: 3, customer: { id: 3, name: 'customer three', location: 'Semarang', priority: "low", status: "prospect" } }, startTime: "2023-10-05 17:00:00", endTime: "2023-10-05 18:00:00", type: "other", description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin pretium cursus nulla at lacinia. Fusce egestas egestas vulputate. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque pulvinar commodo justo ac luctus. Nullam quis semper.' },
]);
const pastMissions = ref([
  { id: 1, managedCustomer: { id: 1, customer: { id: 1, name: 'customer one', location: 'Bandung', priority: "high", status: "new" } }, startTime: "2023-08-05 15:00:00", endTime: "2023-08-05 16:00:00", type: "call", description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin pretium cursus nulla at lacinia. Fusce egestas egestas vulputate. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque pulvinar commodo justo ac luctus. Nullam quis semper.' },
  { id: 2, managedCustomer: { id: 2, customer: { id: 2, name: 'customer two', location: 'Bandung', priority: "medium", status: "follow up" } }, startTime: "2023-08-05 16:00:00", endTime: "2023-08-05 17:00:00", type: "meeting", description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin pretium cursus nulla at lacinia. Fusce egestas egestas vulputate. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque pulvinar commodo justo ac luctus. Nullam quis semper.' },
  { id: 3, managedCustomer: { id: 3, customer: { id: 3, name: 'customer three', location: 'Jakarta', priority: "low", status: "prospect" } }, startTime: "2023-08-05 17:00:00", endTime: "2023-08-05 18:00:00", type: "other", description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin pretium cursus nulla at lacinia. Fusce egestas egestas vulputate. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque pulvinar commodo justo ac luctus. Nullam quis semper.' },
]);

const lastSalesMissionReport = ref([
  { id: 1, customer: { id: 1, name: 'customer one' }, salesMission: { id: 1, name: 'sales mission one' }, submitTime: "2022-03-04" },
  { id: 2, customer: { id: 2, name: 'customer two' }, salesMission: { id: 2, name: 'sales mission two' }, submitTime: "2022-03-04" },
  { id: 3, customer: { id: 1, name: 'customer one' }, salesMission: { id: 2, name: 'sales mission two' }, submitTime: "2022-03-04" },
  { id: 4, customer: { id: 1, name: 'customer one' }, salesMission: { id: 3, name: 'sales mission three' }, submitTime: "2022-03-04" },
  { id: 5, customer: { id: 2, name: 'customer two' }, salesMission: { id: 3, name: 'sales mission four' }, submitTime: "2022-03-04" },
]);

const limitString = (string: string, size: number) => useStringLimiter(string, size) 
</script>

<script lang="ts">
export default {
  name: 'SalesDashboard',
}
</script>

<style lang="scss" scoped></style>