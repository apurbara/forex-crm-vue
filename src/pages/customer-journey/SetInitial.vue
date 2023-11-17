<template>
  <div>
    <h1 class="page-title">Set Initial Customer Journey</h1>
    <div class="form">
      <customer-journey-component :customer-journey="customerJourney" />
      <div class="d-flex justify-end">
        <v-btn :disabled="!customerJourney.isValidProperties()" @click="submit">Submit</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CustomerJourneyComponent from '@/domain/model/CustomerJourneyComponent.vue';
import CustomerJourney, { CustomerJourneyType } from '@/domain/model/customer-journey';
import { CompanyUserRoleInterface } from '@/domain/user-role/role-interfaces';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const customerJourney = reactive(new CustomerJourney());

const { httpRequest, userRepository, cache } = useDependencyInjection()
const router = useRouter()


const submit = async () => {
  const response = await userRepository.getUser<CompanyUserRoleInterface>()
    .executeGraphqlMutationInCompany<{ setInitialCustomerJourney: CustomerJourneyType }>(httpRequest, {
      operation: 'setInitialCustomerJourney',
      variables: customerJourney.toGraphqlVariables(),
      fields: ['id', 'disabled', 'createdTime', 'name', 'description', 'initial']
    })
  const data = response.setInitialCustomerJourney
  cache?.set(`customer-journey-${data.id}`, data)
  router.push(`/customer-journey/${data.id}`)
}

</script>

<style lang="scss" scoped></style>