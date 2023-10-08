<template>
  <div class="pa-4">
    <div class="mb-4">Add Manager</div>
    <v-row>
      <v-col cols="12">
        <v-text-field label="name" v-model="manager.name" />
      </v-col>
      <v-col cols="6">
        <v-text-field label="email" v-model="manager.email" />
      </v-col>
      <v-col cols="6">
        <v-text-field label="phone" v-model="manager.phone" />
      </v-col>
    </v-row>
    <div class="d-flex justify-center">
      <v-btn>submit</v-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import HttpRequestInterface from '@/domain/http-request-interface';
import Manager from '@/domain/model/manager';
import UserRepository from '@/domain/user-repository';
import { reactive } from 'vue';
import { inject } from 'vue';

const httpRequest = inject<HttpRequestInterface>('httpRequest')!;
const user = inject<UserRepository>('userRepository')?.getUser()!;

const manager = reactive(new Manager())

</script>

<style lang="scss" scoped></style>