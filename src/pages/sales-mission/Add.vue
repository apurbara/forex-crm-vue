<template>
  <div class="pa-4">
    <div class="mb-4">Add Sales Activity</div>
    <v-row>
      <v-col cols="12">
        <v-text-field label="name" v-model="salesMission.name" />
      </v-col>
      <v-col cols="12">
        <v-textarea label="description" v-model="salesMission.description" />
      </v-col>
    </v-row>
    <div class="d-flex justify-center mt-4">
      <v-btn>submit</v-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import HttpRequestInterface from '@/domain/http-request-interface';
import SalesMission from '@/domain/model/sales-mission';
import UserRepository from '@/domain/user-repository';
import { reactive } from 'vue';
import { inject } from 'vue';

const httpRequest = inject<HttpRequestInterface>('httpRequest')!;
const user = inject<UserRepository>('userRepository')?.getUser()!;

const salesMission = reactive(new SalesMission())

</script>

<style lang="scss" scoped></style>