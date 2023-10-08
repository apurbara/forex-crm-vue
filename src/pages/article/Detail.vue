<template>
  <div>
    <v-row class="pa-8">
      <v-col cols="12">
        <v-text-field label="name" v-model="article.name" />
      </v-col>
      <v-col cols="12">
        <v-textarea label="description" v-model="article.description" />
      </v-col>
      <v-col cols="12">
        Article Content
        <Editor v-model="article.content" editorStyle="height: 320px" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import HttpRequestInterface from '@/domain/http-request-interface';
import Article, { ArticleDataInterface } from '@/domain/model/product/article';
import UserRepository from '@/domain/user-repository';
import { reactive } from 'vue';
import { inject } from 'vue';
import Editor from 'primevue/editor';

const props = defineProps<{ articleId: string }>()
const httpRequest = inject<HttpRequestInterface>('httpRequest')!;
const user = inject<UserRepository>('userRepository')?.getUser()!;

const article = reactive(new Article())
user.submitGetRequest<ArticleDataInterface>(httpRequest, `/article/${props.articleId}`)
  .then((res) => { article.load(res) })

</script>

<style lang="scss" scoped></style>