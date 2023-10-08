<template>
  <div>
    <div class="d-flex justify-space-between ma-2 pa-0">
      <div>Sales List</div>
    </div>
    <PaginationComponent class="ma-2 pa-0" :pagination="salesSummaryList">
      <v-row class="py-4">
        <v-col v-for="(sales, index) in salesSummaryList.list" cols="12" sm="4" md="3" :key="sales.id ?? index">
          <PersonCardComponent :person="sales" :to="`/sales-summary/${sales.id}`">
            <template v-slot:subtitle>
              {{ sales.location ?? 'Bandung, Jawa Barat' }}
            </template>
            <v-progress-linear v-model="sales.targetRealization" height="10" class="mt-2" color="green"></v-progress-linear>
            <div class="mt-2">
              Assigned Customer: {{ sales.managedCustomerCount }}
            </div>
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

const salesSummaryList = reactive(new Pagination<SalesListDataInterface>(
  async (pagination: Pagination<SalesListDataInterface>) =>
    await user.submitGetRequest(httpRequest, '/sales-summary', pagination.getQueryParameters())
))
salesSummaryList.init();


</script>

<style lang="scss" scoped></style>