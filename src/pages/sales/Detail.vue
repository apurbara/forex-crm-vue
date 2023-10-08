<template>
  <div>
    <v-row class="pa-8">
      <v-col cols="12">
        <v-text-field label="name" v-model="sales.name" />
      </v-col>
      <v-col cols="6">
        <v-text-field label="email" v-model="sales.email" />
      </v-col>
      <v-col cols="6">
        <v-text-field label="phone" v-model="sales.phone" />
      </v-col>
      <v-col cols="12">
        <v-text-field label="location" v-model="sales.location" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import HttpRequestInterface from '@/domain/http-request-interface';
import Sales, { SalesDataInterface } from '@/domain/model/sales';
import UserRepository from '@/domain/user-repository';
import { reactive } from 'vue';
import { inject } from 'vue';

const props = defineProps<{ salesId: string }>()
const httpRequest = inject<HttpRequestInterface>('httpRequest')!;
const user = inject<UserRepository>('userRepository')?.getUser()!;

const sales = reactive(new Sales())
user.submitGetRequest<SalesDataInterface>(httpRequest, `/sales/${props.salesId}`)
  .then((res) => { sales.load(res) })

</script>

<style lang="scss" scoped></style>