<template>
  <h1 class="page-title">Admin Dashboard</h1>
  <AdminDashboardCompanyMetric />
  <AdminDashboardSalesPerformanceMetric />
  <AdminDashboardSalesRank />
</template>

<script setup lang="ts">
import AdminDashboardSalesPerformanceMetric from './AdminDashboardSalesPerformanceMetric.vue';
import AdminDashboardSalesRank from './AdminDashboardSalesRank.vue';
import AdminDashboardCompanyMetric from './AdminDashboardCompanyMetric.vue';

</script>

<style scoped></style>