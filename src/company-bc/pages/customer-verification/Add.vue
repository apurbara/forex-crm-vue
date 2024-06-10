<template>
  <div>
    <h1 class="page-title">Add Customer Verification</h1>
    <div class="form">
      <CustomerVerificationComponent :customer-verification="customerVerification" />
      <div class="d-flex justify-end">
        <v-btn :disabled="!customerVerification.isValidProperties()" @click="submit">Submit</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CustomerVerificationComponent from '@/company-bc/domain/model/CustomerVerificationComponent.vue';
import CustomerVerification, { CustomerVerificationType } from '@/company-bc/domain/model/customer-verification';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const customerVerification = reactive(new CustomerVerification());

const { httpRequest, companyUserRepository, cache } = useDependencyInjection()
const router = useRouter()


const submit = async () => {
  const response = await companyUserRepository.getUser()
    .executeGraphqlMutationInCompany<{ addCustomerVerification: CustomerVerificationType }>(httpRequest, {
      operation: 'addCustomerVerification',
      variables: customerVerification.toGraphqlVariables(),
      fields: [
        'id', 'disabled', 'createdTime', 'name', 'description', 'weight', 'position'
      ]
    })
  cache?.set(`customer-verification-${response?.addCustomerVerification.id}`, response?.addCustomerVerification)
  router.push(`/customer-verification/${response?.addCustomerVerification.id}`)
}

</script>

<style lang="scss" scoped></style>