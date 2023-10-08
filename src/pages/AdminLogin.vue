<script lang="ts" setup>
import { reactive, inject } from 'vue';
import UserRepository from '@/domain/user-repository';
import Admin from '@/domain/user-role/admin';
import LoginPayload from '@/domain/user-role/login-payload';
import HttpRequestInterface from '@/domain/http-request-interface';
import LoginTask from '@/domain/task/user-bc/by-guest/login-task';

const loginPayload = reactive(new LoginPayload());

const httpRequest = inject<HttpRequestInterface>('httpRequest')!;
const userRepository = inject<UserRepository>('userRepository')!;

const login = async () => {
  const adminData = await new LoginTask(httpRequest).adminLogin(loginPayload);
  userRepository.logUserIn(new Admin(adminData));
}
</script>
    
<template>
  <div class="d-flex align-center justify-center pa-4">
    <v-card class="pa-4" min-width="400px" max-width="400px">
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