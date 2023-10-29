<template>
  <div>
    <h1 class="page-title">Add Customer Verification</h1>
    <div class="form">
      <customer-verification-component :customer-verification="customerVerification" />
      <div class="d-flex justify-end">
        <v-btn :disabled="!customerVerification.isValidProperties()" @click="submit">Submit</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CustomerVerificationComponent from '@/domain/model/CustomerVerificationComponent.vue';
import CustomerVerification, { CustomerVerificationType } from '@/domain/model/customer-verification';
import { CompanyUserRoleInterface } from '@/domain/user-role/role-interfaces';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const customerVerification = reactive(new CustomerVerification());

const { httpRequest, userRepository, cache } = useDependencyInjection()
const router = useRouter()


const submit = async () => {
  const response = await userRepository.getUser<CompanyUserRoleInterface>()
    .executeGraphqlMutationInCompany<{ addCustomerVerification: CustomerVerificationType }>(httpRequest, {
      operation: 'addCustomerVerification',
      variables: customerVerification.toGraphqlVariables(),
      fields: ['id', 'disabled', 'createdTime', 'name', 'description']
    })
  const data = response.addCustomerVerification
  cache?.set(`customer-verification-${data.id}`, data)
  router.push(`/customer-verification/${data.id}`)
}

</script>

<style lang="scss" scoped></style>