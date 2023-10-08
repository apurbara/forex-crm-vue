<template>
  <div>
    <v-row class="pa-8">
      <v-col cols="12">
        <v-text-field label="name" v-model="salesMission.name" />
      </v-col>
      <v-col cols="12">
        <v-textarea label="description" v-model="salesMission.description" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import HttpRequestInterface from '@/domain/http-request-interface';
import SalesMission, { SalesMissionDataInterface } from '@/domain/model/sales-mission';
import UserRepository from '@/domain/user-repository';
import { reactive } from 'vue';
import { inject } from 'vue';

const props = defineProps<{ salesActivityId: string }>()
const httpRequest = inject<HttpRequestInterface>('httpRequest')!;
const user = inject<UserRepository>('userRepository')?.getUser()!;

const salesMission = reactive(new SalesMission())
user.submitGetRequest<SalesMissionDataInterface>(httpRequest, `/sales-activity/${props.salesActivityId}`)
  .then((res) => { salesMission.load(res) })

</script>

<style lang="scss" scoped></style>