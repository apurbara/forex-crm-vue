<template>
  <div>
    <h1 class="page-title">Customer Verification Detail</h1>
    <div class="form">
      <customer-verification-component :customer-verification="customerVerification" />
      <v-switch color="success" label="Active" v-model="customerVerification.disabled" :true-value="false"
        :false-value="true" />
      <p>created time: {{ customerVerification.createdTime }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CustomerVerificationComponent from '@/domain/model/CustomerVerificationComponent.vue';
import CustomerVerification, { CustomerVerificationType } from '@/domain/model/customer-verification';
import { CompanyUserRoleInterface } from '@/domain/user-role/role-interfaces';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted } from 'vue';
import { reactive } from 'vue';

const { httpRequest, userRepository, cache } = useDependencyInjection();

const customerVerification = reactive(new CustomerVerification())
const props = defineProps<{ customerVerificationId: string }>()

onMounted(async () => {
  const cacheData = cache?.pull<CustomerVerificationType>(`customer-verification-${props.customerVerificationId}`);
  if (cacheData) {
    customerVerification.load(cacheData);
  } else {
    const response = await userRepository?.getUser<CompanyUserRoleInterface>()
      .executeGraphqlQueryInCompany<{ customerverificationDetail: CustomerVerificationType }>(httpRequest, {
        operation: 'customerverificationDetail',
        variables: { customerverificationId: { type: 'ID!', value: props.customerVerificationId } },
        fields: ['id', 'name', 'description', 'disabled', 'createdTime'],
      })
    customerVerification.load(response.customerverificationDetail)
  }
})
</script>

<style lang="scss" scoped></style>