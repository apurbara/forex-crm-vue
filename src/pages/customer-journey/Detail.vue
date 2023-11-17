<template>
  <div>
    <h1 class="page-title">Customer Journey Detail</h1>
    <div class="form">
      <customer-journey-component :customer-journey="customerJourney" />
      <div class="d-inline-flex justify-start align-center">
        <v-switch color="success" label="Active" v-model="customerJourney.disabled" :true-value="false"
          :false-value="true" class="mr-4" hide-details />
        <v-chip v-if="customerJourney.initial" color="success">initial</v-chip>
      </div>
      <p>created time: {{ customerJourney.createdTime }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CustomerJourneyComponent from '@/domain/model/CustomerJourneyComponent.vue';
import CustomerJourney, { CustomerJourneyType } from '@/domain/model/customer-journey';
import { CompanyUserRoleInterface } from '@/domain/user-role/role-interfaces';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted } from 'vue';
import { reactive } from 'vue';

const { httpRequest, userRepository, cache } = useDependencyInjection();

const customerJourney = reactive(new CustomerJourney())
const props = defineProps<{ customerJourneyId: string }>()

onMounted(async () => {
  const cacheData = cache?.pull<CustomerJourneyType>(`customer-journey-${props.customerJourneyId}`);
  if (cacheData) {
    customerJourney.load(cacheData);
  } else {
    const response = await userRepository?.getUser<CompanyUserRoleInterface>()
      .executeGraphqlQueryInCompany<{ customerJourneyDetail: CustomerJourneyType }>(httpRequest, {
        operation: 'customerJourneyDetail',
        variables: { customerJourneyId: { type: 'ID!', value: props.customerJourneyId } },
        fields: ['id', 'disabled', 'createdTime', 'name', 'description', 'initial'],
      })
    customerJourney.load(response.customerJourneyDetail)
  }
})
</script>

<style lang="scss" scoped></style>