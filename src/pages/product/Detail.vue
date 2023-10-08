<template>
  <div>
    <v-row class="pa-8">
      <v-col cols="12">
        <v-text-field label="name" v-model="product.name" />
      </v-col>
      <v-col cols="12">
        <v-textarea label="description" v-model="product.description" />
      </v-col>
      <v-col cols="6">
        <v-text-field label="score" v-model="product.score" type="number" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import HttpRequestInterface from '@/domain/http-request-interface';
import Product, { ProductDataInterface } from '@/domain/model/product';
import UserRepository from '@/domain/user-repository';
import { reactive } from 'vue';
import { inject } from 'vue';

const props = defineProps<{ productId: string }>()
const httpRequest = inject<HttpRequestInterface>('httpRequest')!;
const user = inject<UserRepository>('userRepository')?.getUser()!;

const product = reactive(new Product())
user.submitGetRequest<ProductDataInterface>(httpRequest, `/product/${props.productId}`)
  .then((res) => { product.load(res) })

</script>

<style lang="scss" scoped></style>