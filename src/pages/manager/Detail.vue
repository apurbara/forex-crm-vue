<template>
  <div>
    <v-row class="pa-8">
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
  </div>
</template>

<script lang="ts" setup>
import HttpRequestInterface from '@/domain/http-request-interface';
import Manager, { ManagerDataInterface } from '@/domain/model/manager';
import UserRepository from '@/domain/user-repository';
import { reactive } from 'vue';
import { inject } from 'vue';

const props = defineProps<{ managerId: string }>()
const httpRequest = inject<HttpRequestInterface>('httpRequest')!;
const user = inject<UserRepository>('userRepository')?.getUser()!;

const manager = reactive(new Manager())
user.submitGetRequest<ManagerDataInterface>(httpRequest, `/manager/${props.managerId}`)
  .then((res) => { manager.load(res) })

</script>

<style lang="scss" scoped></style>