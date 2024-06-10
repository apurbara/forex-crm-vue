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
import CursorPagination from '@/resources/components/cursor-pagination';
import Customer from '@/sales-bc/domain/dependency-model/customer';
import { CustomerAssignmentType } from '@/sales-bc/domain-old/model/sales/customer-assignment';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';


const customer = reactive(new Customer());

const { httpRequest, salesRepository, cache } = useDependencyInjection();
const router = useRouter()


const submit = async () => {
  const response = await salesRepository.getUser()
    .executeSalesGraphqlMutation<{ registerNewCustomer: CustomerAssignmentType }>(httpRequest, {
      operation: "registerNewCustomer",
      variables: customer.toGraphqlVariables(),
      fields: [
        "id", "status", "createdTime",
        { customer: ["id", "name", "email", "phone", { area: ["name"] }] },
        { customerJourney: ["id", "name", "description", "initial"] },
        { salesActivitySchedules: CursorPagination.wrapResultFields(['id', 'createdTime', 'status', 'startTime', 'endTime']) }
      ]
    })
  const data = response.registerNewCustomer
  cache.set(`customer-assignment-${data.id}`, data)
  router.push(`/customer-assignment/${data.id}`)
}

</script>

<style lang="scss" scoped></style>