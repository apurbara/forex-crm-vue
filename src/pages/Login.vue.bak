<script lang="ts" setup>
import HttpRequestInterface from '@/domain/http-request-interface';
import LoginTask from '@/domain/task/user-bc/by-guest/login-task';
import UserRepository from '@/domain/user-repository';
import LoginPayload from '@/domain/user-role/login-payload';
import Manager from '@/domain/user-role/manager';
import Sales from '@/domain/user-role/sales';
import { reactive, inject, ref } from 'vue';

const loginPayload = reactive(new LoginPayload());
const roleSelection = ["sales", "manager"];
const selectedRole = ref('sales');

const httpRequest = inject<HttpRequestInterface>('httpRequest')!;
const userRepository = inject<UserRepository>('userRepository')!;

const login = async () => {
  const task = new LoginTask(httpRequest);
  if (selectedRole.value == "manager") {
    const managerData = await task.managerLogin(loginPayload);
    userRepository.logUserIn(new Manager(managerData));
  } else {
    const salesData = await task.salesLogin(loginPayload);
    userRepository.logUserIn(new Sales(salesData));
  }
}
</script>
    
<template>
  <div class="d-flex align-center justify-center pa-4">
    <v-card class="pa-4" min-width="400px" max-width="400px">
      <v-select v-model="selectedRole" :items="roleSelection" label="User Role" outlined></v-select>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="loginPayload.email" label="Email" :rules="[loginPayload.isValidEmail()]" />
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="loginPayload.password" label="Password" type="password"
            :rules="[loginPayload.isValidPassword()]" />
        </v-col>
      </v-row>
      <v-divider class="mt-12" />
      <v-card-actions>
        <v-btn :disabled="!loginPayload.isValidLoginPayload()" block @click="login">
          Login
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style lang="scss" scoped></style>