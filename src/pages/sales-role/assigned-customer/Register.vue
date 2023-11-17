<template>
  <div>
    <h1 class="page-title">Register New Customer</h1>
    <div class="form">
      <customer-register-component :customer="customer" />
      <div class="d-flex justify-end">
        <v-btn :disabled="!customer.isValidToRegister()" @click="submit">Submit</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CustomerRegisterComponent from '@/domain/model/CustomerRegisterComponent.vue';
import Customer from '@/domain/model/customer';
import { AssignedCustomerType } from '@/domain/model/personnel/manager/sales/assigned-customer';
import SalesRole from '@/domain/user-role/personnel/sales-role';
import CursorPagination from '@/resources/components/cursor-pagination';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const customer = reactive(new Customer());

const { httpRequest, userRepository, cache } = useDependencyInjection();
const router = useRouter()


const submit = async () => {
  const response = await userRepository.getUser<SalesRole>()
    .executeSalesGraphqlMutation<{ registerNewCustomer: AssignedCustomerType }>(httpRequest, {
      operation: "registerNewCustomer",
      variables: customer.toGraphqlVariables(),
      fields: [
        "id", "status", "createdTime", 
        { customer: ["id", "name", "email", "phone", { area: ["name"] }] },
        { customerJourney: ["id", "name", "description", "initial"] },
        { schedules: CursorPagination.wrapResultFields(['id', 'createdTime', 'status', 'startTime', 'endTime']) }
      ]
    })
  const data = response.registerNewCustomer
  cache.set(`assigned-customer-${data.id}`, data)
  router.push(`/assigned-customer/${data.id}`)
}

</script>

<style lang="scss" scoped></style>