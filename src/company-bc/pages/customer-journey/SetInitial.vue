<template>
  <div>
    <h1 class="page-title">Set Initial Customer Journey</h1>
    <div class="form">
      <CustomerJourneyComponent :customer-journey="customerJourney" />
      <div class="d-flex justify-end">
        <v-btn :disabled="!customerJourney.isValidProperties()" @click="submit">Submit</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CustomerJourneyComponent from '@/company-bc/domain/model/CustomerJourneyComponent.vue';
import CustomerJourney, { CustomerJourneyType } from '@/company-bc/domain/model/customer-journey';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const customerJourney = reactive(new CustomerJourney());

const { httpRequest, companyUserRepository, cache } = useDependencyInjection()
const router = useRouter()


const submit = async () => {
  const response = await companyUserRepository.getUser()
    .executeGraphqlMutationInCompany<{ setInitialCustomerJourney: CustomerJourneyType }>(httpRequest, {
      operation: 'setInitialCustomerJourney',
      variables: customerJourney.toGraphqlVariables(),
      fields: [
        'id', 'disabled', 'createdTime', 'initial', 'name', 'description'
      ]
    })
  cache?.set(`customer-journey-${response?.setInitialCustomerJourney.id}`, response?.setInitialCustomerJourney)
  router.push(`/customer-journey/${response?.setInitialCustomerJourney.id}`)
}

</script>

<style lang="scss" scoped></style>