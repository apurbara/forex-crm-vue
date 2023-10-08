<template>
  <div>
    <div class="d-flex justify-space-between ma-2 pa-0">
      <div>Sales List</div>
      <v-btn to="/sales/add">add sales</v-btn>
    </div>
    <PaginationComponent class="ma-2 pa-0" :pagination="salesList">
      <v-row class="py-4">
        <v-col v-for="(sales, index) in salesList.list" cols="12" sm="4" md="3" :key="sales.id ?? index">
          <PersonCardComponent :person="sales" :to="`/sales/${sales.id}`">
            <template v-slot:subtitle>
              {{ sales.location ?? 'Bandung, Jawa Barat' }}
            </template>
          </PersonCardComponent>
          <!-- <PersonCardComponent :person="sales" @click="$router.push(`/sales/${sales.id}`)" pointer-cursor></PersonCardComponent> -->
        </v-col>
      </v-row>
    </PaginationComponent>
  </div>
</template>

<script lang="ts" setup>
import HttpRequestInterface from '@/domain/http-request-interface';
import { SalesListDataInterface } from '@/domain/model/sales';
import UserRepository from '@/domain/user-repository';
import PaginationComponent from '@/resources/components/PaginationComponent.vue';
import Pagination from '@/resources/components/pagination';
import PersonCardComponent from '@/shared/components/person-card-component.vue';
import { inject, reactive } from 'vue';

const httpRequest = inject<HttpRequestInterface>('httpRequest')!;
const user = inject<UserRepository>('userRepository')?.getUser()!;

const salesList = reactive(new Pagination<SalesListDataInterface>(
  async (pagination: Pagination<SalesListDataInterface>) =>
    await user.submitGetRequest(httpRequest, '/sales', pagination.getQueryParameters())
))
salesList.init();


</script>

<style lang="scss" scoped></style>