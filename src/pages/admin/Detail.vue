<template>
  <div>
    <v-row class="pa-8">
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
  </div>
</template>

<script lang="ts" setup>
import HttpRequestInterface from '@/domain/http-request-interface';
import Admin, { AdminDataInterface } from '@/domain/model/admin';
import UserRepository from '@/domain/user-repository';
import { reactive } from 'vue';
import { inject } from 'vue';

const props = defineProps<{ adminId: string }>()
const httpRequest = inject<HttpRequestInterface>('httpRequest')!;
const user = inject<UserRepository>('userRepository')?.getUser()!;

const admin = reactive(new Admin())
user.submitGetRequest<AdminDataInterface>(httpRequest, `/admin/${props.adminId}`)
  .then((res) => { admin.load(res) })

</script>

<style lang="scss" scoped></style>