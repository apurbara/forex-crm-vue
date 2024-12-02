<template>
  <section class="page-section ma-2" v-if="customerAssignment.closingRequests.length > 0">
    <h2 class="section-title">Closing Request Log</h2>
    <v-table density="compact" style="width: 100%;" class="datatable px-2">
      <thead>
        <tr>
          <th>time</th>
          <th>transaction value</th>
          <th>note</th>
          <th>remark</th>
          <th>status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(closingRequest, key) in customerAssignment.closingRequests" :key="closingRequest.id ?? key">
          <td>{{ new Date(closingRequest.createdTime!).toLocaleString() }}</td>
          <td>{{ closingRequest.transactionValue }}</td>
          <td>{{ closingRequest.note }}</td>
          <td>{{ closingRequest.remark }}</td>
          <td>{{ closingRequest.status }}</td>
        </tr>
      </tbody>
    </v-table>
  </section>
</template>

<script setup lang="ts">
import CustomerAssignment from '@/sales-bc/domain/model/sales/customer-assignment';

defineProps<{ customerAssignment: CustomerAssignment }>();
</script>

<style scoped></style>