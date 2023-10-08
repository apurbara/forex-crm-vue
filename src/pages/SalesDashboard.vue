<template>
  <div>

    <section>
      <h2>Target Realization</h2>
      <div>
        <v-progress-linear model-value="20"></v-progress-linear>
      </div>
    </section>

    <section class="my-8">
      <h2>Upcoming Mission</h2>
      <v-card v-for="(upcomingMission, key) in upcomingMissions" :key="upcomingMission.id ?? key"
        class="d-flex justify-space-between align center my-1"
        :to="`/customer-summary/${upcomingMission.managedCustomer.customer.id}`">
        <v-card-item class="d-flex justify-start flex-grow-1 flex-shrink-1">
          <v-card-title class="flex-grow-0 flex-shrink-0" style="min-width: 100px;">{{
            upcomingMission.managedCustomer.customer.name }}</v-card-title>
          <v-card-subtitle class="flex-grow-1 flex-shrink-1" style="min-width: 200px;">{{
            upcomingMission.salesMission.name }}</v-card-subtitle>
        </v-card-item>
        <v-card-text class="flex-grow-0 flex-shrink-0" style="min-width: 100px;">{{ upcomingMission.deadline
        }}</v-card-text>
      </v-card>
    </section>

    <section class="my-8">
      <h2>Managed Customer</h2>
      <v-card variant="outlined" class="d-flex justify-start align-content-start align-center">
        <person-card-component v-for="(managedCustomer, key) in managedCustomers" :key="managedCustomer.id ?? key"
          :person="managedCustomer.customer" :to="`/customer-summary/${managedCustomer.customer.id}`" class="ma-2"
          style="width: 280px;">
          <template v-slot:subtitle>{{ managedCustomer.customer.location }}
          </template>
        </person-card-component>
      </v-card>
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
          <tr v-for="(report, key) in lastSalesMissionReport" :key="report.id ?? key" @click="$router.push(`/sales-mission-report/${report.id}`)" style="cursor: pointer;">
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
import PersonCardComponent from '@/shared/components/person-card-component.vue';
import { ref } from 'vue';

const upcomingMissions = ref([
  { id: 1, managedCustomer: { id: 1, customer: { id: 1, name: 'customer one' } }, salesMission: { id: 1, name: 'sales mission one' }, deadline: "2023-11-08" },
  { id: 2, managedCustomer: { id: 2, customer: { id: 2, name: 'customer two' } }, salesMission: { id: 2, name: 'sales mission two' }, deadline: "2023-12-01" },
  { id: 3, managedCustomer: { id: 3, customer: { id: 3, name: 'customer three' } }, salesMission: { id: 3, name: 'sales mission three' }, deadline: "2023-12-24" },
]);
const managedCustomers = ref([
  { id: "1", customer: { id: 1, name: 'customer one', email: "customerOne@email.org", phone: '082123123112', location: 'Bandung', activityTotalScores: 345, avatar: '' } },
  { id: "2", customer: { id: 2, name: 'customer two', email: "customerTwo@email.org", phone: '083423413412', location: 'Cimahi', activityTotalScores: 124, avatar: '' } },
  { id: "3", customer: { id: 3, name: 'customer three', email: "customerThree@email.org", phone: '083423413412', location: 'Jakarta', activityTotalScores: 775, avatar: '' } },
]);
const lastSalesMissionReport = ref([
  { id: 1, customer: { id: 1, name: 'customer one' }, salesMission: { id: 1, name: 'sales mission one' }, submitTime: "2022-03-04" },
  { id: 2, customer: { id: 2, name: 'customer two' }, salesMission: { id: 2, name: 'sales mission two' }, submitTime: "2022-03-04" },
  { id: 3, customer: { id: 1, name: 'customer one' }, salesMission: { id: 2, name: 'sales mission two' }, submitTime: "2022-03-04" },
  { id: 4, customer: { id: 1, name: 'customer one' }, salesMission: { id: 3, name: 'sales mission three' }, submitTime: "2022-03-04" },
  { id: 5, customer: { id: 2, name: 'customer two' }, salesMission: { id: 3, name: 'sales mission four' }, submitTime: "2022-03-04" },
]);
</script>

<script lang="ts">
export default {
  name: 'SalesDashboard',
}
</script>

<style lang="scss" scoped></style>