<template>
  <div>
    <div class="d-flex justify-space-between ma-2 pa-0">
      <div>Article List</div>
      <v-btn to="/article/add">add article</v-btn>
    </div>
    <PaginationComponent class="ma-2 pa-0" :pagination="articleList">
      <v-row class="py-4">
        <v-col v-for="(article, index) in articleList.list" cols="12" sm="4" md="3" :key="article.id ?? index">
          <ItemCardComponent :item="article" :to="`/article/${article.id}`">
          </ItemCardComponent>
        </v-col>
      </v-row>
    </PaginationComponent>
  </div>
</template>

<script lang="ts" setup>
import HttpRequestInterface from '@/domain/http-request-interface';
import { ArticleListDataInterface } from '@/domain/model/product/article';
import UserRepository from '@/domain/user-repository';
import PaginationComponent from '@/resources/components/PaginationComponent.vue';
import Pagination from '@/resources/components/pagination';
import ItemCardComponent from '@/shared/components/item-card-component.vue';
import { inject, reactive } from 'vue';

const httpRequest = inject<HttpRequestInterface>('httpRequest')!;
const user = inject<UserRepository>('userRepository')?.getUser()!;

const articleList = reactive(new Pagination<ArticleListDataInterface>(
  async (pagination: Pagination<ArticleListDataInterface>) =>
    await user.submitGetRequest(httpRequest, '/article', pagination.getQueryParameters())
))
articleList.init();


</script>

<style lang="scss" scoped></style>