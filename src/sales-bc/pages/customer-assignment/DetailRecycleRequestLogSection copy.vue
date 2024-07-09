<template>
  <section class="page-section ma-2" v-if="customerAssignment.recycleRequests.length > 0">
    <h2 class="section-title">Recycle Request Log</h2>
    <v-table density="compact" style="width: 100%;" class="datatable px-2">
      <thead>
        <tr>
          <th>time</th>
          <th>note</th>
          <th>remark</th>
          <th>status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(recycleRequest, key) in customerAssignment.recycleRequests" :key="recycleRequest.id ?? key">
          <td>{{ new Date(recycleRequest.createdTime!).toLocaleString() }}</td>
          <td>{{ recycleRequest.note }}</td>
          <td>{{ recycleRequest.remark }}</td>
          <td>{{ recycleRequest.status }}</td>
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