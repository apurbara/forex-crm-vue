<template>
  <div class="pa-4">
    <div class="mb-4">Add Admin</div>
    <v-row>
      <v-col cols="12">
        <v-text-field label="name" v-model="admin.name" />
      </v-col>
      <v-col cols="6">
        <v-text-field label="email" v-model="admin.email" />
      </v-col>
      <v-col cols="6">
        <v-text-field label="phone" v-model="admin.phone" />
      </v-col>
    </v-row>
    <div class="d-flex justify-center">
      <v-btn>submit</v-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import HttpRequestInterface from '@/domain/http-request-interface';
import Admin from '@/domain/model/admin';
import UserRepository from '@/domain/user-repository';
import { reactive } from 'vue';
import { inject } from 'vue';

const httpRequest = inject<HttpRequestInterface>('httpRequest')!;
const user = inject<UserRepository>('userRepository')?.getUser()!;

const admin = reactive(new Admin())

</script>

<style lang="scss" scoped></style>