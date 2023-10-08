<template>
  <div class="pa-4">
    <div class="mb-4">Add Mail Content</div>
    <v-row>
      <v-col cols="6">
        <v-select label="product" :items="productList" itemTitle="name" />
      </v-col>
      <v-col cols="12">
        <v-text-field label="name" v-model="mailContent.name" />
      </v-col>
      <v-col cols="12">
        <v-textarea label="description" v-model="mailContent.description" />
      </v-col>
      <v-col cols="12">
        Email Content
        <Editor v-model="mailContent.content" editorStyle="height: 320px" />
      </v-col>
    </v-row>
    <div class="d-flex justify-center mt-4">
      <v-btn>submit</v-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import HttpRequestInterface from '@/domain/http-request-interface';
import MailContent from '@/domain/model/product/mail-content';
import UserRepository from '@/domain/user-repository';
import { reactive } from 'vue';
import { inject } from 'vue';
import Editor from 'primevue/editor';
import { ref } from 'vue';
import { ProductListDataInterface } from '@/domain/model/product';

const httpRequest = inject<HttpRequestInterface>('httpRequest')!;
const user = inject<UserRepository>('userRepository')?.getUser()!;
const productList = ref<ProductListDataInterface[]>([]);

user.submitGetRequest<{ list: ProductListDataInterface[] }>(httpRequest, '/product')
  .then((res) => productList.value = res.list)

const mailContent = reactive(new MailContent())

</script>

<style lang="scss" scoped></style>