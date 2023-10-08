<template>
  <div>
    <v-row class="pa-8">
      <v-col cols="12">
        <v-text-field label="name" v-model="mailContent.name" />
      </v-col>
      <v-col cols="12">
        <v-textarea label="description" v-model="mailContent.description" />
      </v-col>
      <v-col cols="12">
        Mail Content
        <Editor v-model="mailContent.content" editorStyle="height: 320px" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import HttpRequestInterface from '@/domain/http-request-interface';
import MailContent, { MailContentDataInterface } from '@/domain/model/product/mail-content';
import UserRepository from '@/domain/user-repository';
import { reactive } from 'vue';
import { inject } from 'vue';
import Editor from 'primevue/editor';

const props = defineProps<{ mailContentId: string }>()
const httpRequest = inject<HttpRequestInterface>('httpRequest')!;
const user = inject<UserRepository>('userRepository')?.getUser()!;

const mailContent = reactive(new MailContent())
user.submitGetRequest<MailContentDataInterface>(httpRequest, `/mail-content/${props.mailContentId}`)
  .then((res) => { mailContent.load(res) })

</script>

<style lang="scss" scoped></style>