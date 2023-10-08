<template>
  <div>
    <div class="d-flex justify-space-between ma-2 pa-0">
      <div>Product List</div>
      <v-btn to="/product/add">add product</v-btn>
    </div>
    <PaginationComponent class="ma-2 pa-0" :pagination="productList">
      <v-row class="py-4">
        <v-col v-for="(product, index) in productList.list" cols="12" sm="4" md="3" :key="product.id ?? index">
          <ItemCardComponent :item="product" :to="`/product/${product.id}`">
            score: {{ product.score }}
          </ItemCardComponent>
        </v-col>
      </v-row>
    </PaginationComponent>
  </div>
</template>

<script lang="ts" setup>
import HttpRequestInterface from '@/domain/http-request-interface';
import { ProductListDataInterface } from '@/domain/model/product';
import UserRepository from '@/domain/user-repository';
import PaginationComponent from '@/resources/components/PaginationComponent.vue';
import Pagination from '@/resources/components/pagination';
import ItemCardComponent from '@/shared/components/item-card-component.vue';
import { inject, reactive } from 'vue';

const httpRequest = inject<HttpRequestInterface>('httpRequest')!;
const user = inject<UserRepository>('userRepository')?.getUser()!;

const productList = reactive(new Pagination<ProductListDataInterface>(
  async (pagination: Pagination<ProductListDataInterface>) =>
    await user.submitGetRequest(httpRequest, '/product', pagination.getQueryParameters())
))
productList.init();


</script>

<style lang="scss" scoped></style>