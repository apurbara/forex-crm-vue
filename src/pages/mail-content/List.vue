<template>
  <div>
    <div class="d-flex justify-space-between ma-2 pa-0">
      <div>Mail Content List</div>
      <v-btn to="/mail-content/add">add mail content</v-btn>
    </div>
    <PaginationComponent class="ma-2 pa-0" :pagination="mailContentList">
      <v-row class="py-4">
        <v-col v-for="(mailContent, index) in mailContentList.list" cols="12" sm="4" md="3"
          :key="mailContent.id ?? index">
          <ItemCardComponent :item="mailContent" :to="`/mail-content/${mailContent.id}`">
          </ItemCardComponent>
        </v-col>
      </v-row>
    </PaginationComponent>
  </div>
</template>

<script lang="ts" setup>
import HttpRequestInterface from '@/domain/http-request-interface';
import { MailContentListDataInterface } from '@/domain/model/product/mail-content';
import UserRepository from '@/domain/user-repository';
import PaginationComponent from '@/resources/components/PaginationComponent.vue';
import Pagination from '@/resources/components/pagination';
import ItemCardComponent from '@/shared/components/item-card-component.vue';
import { inject, reactive } from 'vue';

const httpRequest = inject<HttpRequestInterface>('httpRequest')!;
const user = inject<UserRepository>('userRepository')?.getUser()!;

const mailContentList = reactive(new Pagination<MailContentListDataInterface>(
  async (pagination: Pagination<MailContentListDataInterface>) =>
    await user.submitGetRequest(httpRequest, '/mail-content', pagination.getQueryParameters())
))
mailContentList.init();


</script>

<style lang="scss" scoped></style>