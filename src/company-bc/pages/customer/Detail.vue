<template>
  <div>
    <h1 class="page-title">Customer Detail</h1>
    <div class="d-flex justify-end">
    </div>
    <div class="form">
      <CustomerComponent :customer="customer" :readonly="true" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import CustomerComponent from '@/company-bc/domain/model/CustomerComponent.vue';
import Customer, { CustomerType } from '@/company-bc/domain/model/customer';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, reactive, ref } from 'vue';

const { httpRequest, companyUserRepository, cache } = useDependencyInjection();

const customer = reactive(new Customer())
const props = defineProps<{ customerId: string }>()
let cacheData: CustomerType;

onMounted(async () => {
  cacheData = cache?.pull<CustomerType>(`customer-${props.customerId}`);
  if (cacheData) {
    customer.load(cacheData);
  } else {
    const response = await companyUserRepository.getUser()
      .executeGraphqlQueryInCompany<{ customerDetail: CustomerType }>(httpRequest, {
        operation: 'customerDetail',
        variables: { id: { type: 'ID!', value: props.customerId } },
        fields: [
          'id', 'disabled', 'createdTime', 'name', 'email', 'phone', 'source'
        ],
      })
    cacheData = response.customerDetail
    customer.load(cacheData)
  }
})

</script>

<style lang="scss" scoped></style>