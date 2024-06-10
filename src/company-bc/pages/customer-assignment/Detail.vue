<template>
  <div>
    <h1 class="page-title">Customer Assignment Detail</h1>
    <div class="d-flex justify-end">
    </div>
    <div class="form">
      <CustomerComponent :customer="customerAssignment.customer" :readonly="true" />
      <SalesComponent :sales="customerAssignment.sales!" :readonly="true" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import CustomerComponent from '@/company-bc/domain/model/CustomerComponent.vue';
import SalesComponent from '@/company-bc/domain/model/SalesComponent.vue';
import CustomerAssignment, { CustomerAssignmentType } from '@/company-bc/domain/model/sales/customer-assignment';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, reactive, ref } from 'vue';

const { httpRequest, companyUserRepository, cache } = useDependencyInjection();

const customerAssignment = reactive(new CustomerAssignment())
const props = defineProps<{ customerAssignmentId: string }>()
let cacheData: CustomerAssignmentType;

onMounted(async () => {
  cacheData = cache?.pull<CustomerAssignmentType>(`customer-${props.customerAssignmentId}`);
  if (cacheData) {
    customerAssignment.load(cacheData);
  } else {
    const response = await companyUserRepository.getUser()
      .executeGraphqlQueryInCompany<{ customerAssignmentDetail: CustomerAssignmentType }>(httpRequest, {
        operation: 'customerAssignmentDetail',
        variables: { id: { type: 'ID!', value: props.customerAssignmentId } },
        fields: [
          'id',
          { sales: ['id', 'name'] },
          { customer: ['id', 'name', 'phone'] },
          { customerJourney: ['name'] },
        ],
      })
    cacheData = response.customerAssignmentDetail
    customerAssignment.load(cacheData)
  }
})

</script>

<style lang="scss" scoped></style>