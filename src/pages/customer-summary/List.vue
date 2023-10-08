<template>
  <div>
    <div class="d-flex justify-space-between ma-2 pa-0">
      <div>Customer List</div>
    </div>
    <PaginationComponent class="ma-2 pa-0" :pagination="customerSummaryList">
      <v-row class="py-4">
        <v-col v-for="(customer, index) in customerSummaryList.list" cols="12" sm="4" md="3" :key="customer.id ?? index">
          <PersonCardComponent :person="customer" :to="`/customer-summary/${customer.id}`">
            <template v-slot:subtitle>
              {{ customer.location ?? 'Bandung, Jawa Barat' }}
            </template>
            <div class="d-flex justify-space-between align-center mt-2">
              <v-chip>{{ customer.activityTotalScores }}</v-chip>
              <p>{{ customer.managingSales?.sales.name }}</p>
            </div>
          </PersonCardComponent>
          <!-- <PersonCardComponent :person="customer" @click="$router.push(`/customer/${customer.id}`)" pointer-cursor></PersonCardComponent> -->
        </v-col>
      </v-row>
    </PaginationComponent>
  </div>
</template>

<script lang="ts" setup>
import HttpRequestInterface from '@/domain/http-request-interface';
import { CustomerListDataInterface } from '@/domain/model/customer';
import UserRepository from '@/domain/user-repository';
import PaginationComponent from '@/resources/components/PaginationComponent.vue';
import Pagination from '@/resources/components/pagination';
import PersonCardComponent from '@/shared/components/person-card-component.vue';
import { inject, reactive } from 'vue';

const httpRequest = inject<HttpRequestInterface>('httpRequest')!;
const user = inject<UserRepository>('userRepository')?.getUser()!;

const customerSummaryList = reactive(new Pagination<CustomerListDataInterface>(
  async (pagination: Pagination<CustomerListDataInterface>) =>
    await user.submitGetRequest(httpRequest, '/customer-summary', pagination.getQueryParameters())
))
customerSummaryList.init();


</script>

<style lang="scss" scoped></style>