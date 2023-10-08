<template>
  <div class="pa-4">
    <div class="mb-4">Add Product</div>
    <v-row>
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
    <div class="d-flex justify-center">
      <v-btn>submit</v-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import HttpRequestInterface from '@/domain/http-request-interface';
import Product from '@/domain/model/product';
import UserRepository from '@/domain/user-repository';
import { reactive } from 'vue';
import { inject } from 'vue';

const httpRequest = inject<HttpRequestInterface>('httpRequest')!;
const user = inject<UserRepository>('userRepository')?.getUser()!;

const product = reactive(new Product())

</script>

<style lang="scss" scoped></style>