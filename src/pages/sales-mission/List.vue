<template>
  <div>
    <div class="d-flex justify-space-between ma-2 pa-0">
      <div>Sales Mission List</div>
      <v-btn to="/sales-mission/add">add sales mission</v-btn>
    </div>
    <PaginationComponent class="ma-2 pa-0" :pagination="salesMissionList">
      <v-row class="py-4">
        <v-col v-for="(salesMission, index) in salesMissionList.list" cols="12" sm="4" md="3"
          :key="salesMission.id ?? index">
          <ItemCardComponent :item="salesMission" :to="`/sales-mission/${salesMission.id}`">
          </ItemCardComponent>
        </v-col>
      </v-row>
    </PaginationComponent>
  </div>
</template>

<script lang="ts" setup>
import HttpRequestInterface from '@/domain/http-request-interface';
import { SalesMissionListDataInterface } from '@/domain/model/sales-mission';
import UserRepository from '@/domain/user-repository';
import PaginationComponent from '@/resources/components/PaginationComponent.vue';
import Pagination from '@/resources/components/pagination';
import ItemCardComponent from '@/shared/components/item-card-component.vue';
import { inject, reactive } from 'vue';

const httpRequest = inject<HttpRequestInterface>('httpRequest')!;
const user = inject<UserRepository>('userRepository')?.getUser()!;

const salesMissionList = reactive(new Pagination<SalesMissionListDataInterface>(
  async (pagination: Pagination<SalesMissionListDataInterface>) =>
    await user.submitGetRequest(httpRequest, '/sales-activity', pagination.getQueryParameters())
))
salesMissionList.init();


</script>

<style lang="scss" scoped></style>