<template>
  <div class="content login-page d-flex justify-space-around">
    <v-card class="login-card pa-4 mt-12 form" width="400px">
      <v-card-title class="d-flex justify-space-around">
        Login To Continue
      </v-card-title>
      <v-card-item>
        <v-tabs v-model="tab" fixed-tabs color="primary">
          <v-tab value="sales">sales</v-tab>
          <v-tab value="manager">manager</v-tab>
          <v-tab value="admin">admin</v-tab>
        </v-tabs>
        <div class="mt-4">
          <v-window v-model="tab">
            <v-window-item value="sales">
              <SalesLogin />
            </v-window-item>
            <v-window-item value="manager">
              <ManagerLogin />
            </v-window-item>
            <v-window-item value="admin">
              <AdminLogin />
            </v-window-item>
          </v-window>
        </div>
        <!-- <LoginComponent :login-payload="loginPayload" /> -->
      </v-card-item>
      <!-- <v-divider />
      <v-card-actions>
        <v-btn :disabled="!loginPayload.isValidLoginPayload()" block @click="login" variant="elevated" color="primary">
          Login
        </v-btn>
      </v-card-actions> -->
    </v-card>
  </div>
  <!-- <v-tabs v-model="tab" fixed-tabs bg-color="primary">
      <v-tab value="sales">sales</v-tab>
      <v-tab value="manager">manager</v-tab>
      <v-tab value="admin">admin</v-tab>
    </v-tabs>
    <div>
      <v-window v-model="tab">
        <v-window-item value="sales">
          <SalesLogin />
        </v-window-item>
        <v-window-item value="manager">
          <ManagerLogin />
        </v-window-item>
        <v-window-item value="admin">
          <AdminLogin />
        </v-window-item>
      </v-window>
    </div> -->
</template>

<script setup lang="ts">
import AdminLogin from '@/admin-bc/pages/AdminLogin.vue';
import ManagerLogin from '@/manager-bc/pages/ManagerLogin.vue';
import SalesLogin from '@/sales-bc/pages/SalesLogin.vue';
import { ref } from 'vue';

const tab = ref<string>('sales')

</script>

<style scoped></style>