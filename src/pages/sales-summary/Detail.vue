<template>
  <div class="pa-4">
    Target Realization
    <v-progress-linear v-model="sales.targetRealization" height="15" color="green"></v-progress-linear>
    <v-row class="my-4">
      <v-col cols="12">
        <v-text-field label="name" v-model="sales.name" readonly />
      </v-col>
      <v-col cols="6">
        <v-text-field label="email" v-model="sales.email" readonly />
      </v-col>
      <v-col cols="6">
        <v-text-field label="phone" v-model="sales.phone" readonly />
      </v-col>
      <v-col cols="12">
        <v-text-field label="location" v-model="sales.location" readonly />
      </v-col>
    </v-row>
    Assigned Customers
    <v-row>
      <v-col cols="3" v-for="(customer, i) in sales.managedCustomers" :key="customer.id ?? i">
        <PersonCardComponent :person="customer" :to="`/customer-summary/${customer.id}`">
          <template v-slot:subtitle>
            <div class="d-flex justify-space-between align-center">
              <v-chip color="primary">{{ customer.activityTotalScores }}</v-chip>
              <p>{{ customer.location }}</p>
            </div>
          </template>
        </PersonCardComponent>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import HttpRequestInterface from '@/domain/http-request-interface';
import { ComprehensiveSalesDataInterface } from '@/domain/model/sales';
import UserRepository from '@/domain/user-repository';
import PersonCardComponent from '@/shared/components/person-card-component.vue';
import { ref } from 'vue';
import { inject } from 'vue';

const props = defineProps<{ salesId: string }>()
const httpRequest = inject<HttpRequestInterface>('httpRequest')!;
const user = inject<UserRepository>('userRepository')?.getUser()!;

const sales = ref<ComprehensiveSalesDataInterface>({})
user.submitGetRequest<ComprehensiveSalesDataInterface>(httpRequest, `/sales-summary/${props.salesId}`)
  .then((res) => { sales.value = res })

</script>

<style lang="scss" scoped></style>