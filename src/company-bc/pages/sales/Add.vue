<template>
  <div>
    <h1 class="page-title">Add Sales</h1>
    <div class="form">
      <SalesCreateComponent :sales="sales" />
      <div class="d-flex justify-end">
        <v-btn :disabled="!sales.isValidToCreate()" @click="submit">Submit</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SalesCreateComponent from '@/company-bc/domain/model/SalesCreateComponent.vue';
import Sales, { SalesType } from '@/company-bc/domain/model/sales';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const sales = reactive(new Sales());

const { httpRequest, companyUserRepository, cache } = useDependencyInjection()
const router = useRouter()


const submit = async () => {
  const response = await companyUserRepository.getUser()
    .executeGraphqlMutationInCompany<{ addSales: SalesType }>(httpRequest, {
      operation: 'addSales',
      variables: sales.toGraphqlVariables(),
      fields: [
        'id', 'cancelled', 'createdTime', 'cancelTime', 'name', 'email', 'type'
      ]
    })
  cache?.set(`sales-${response?.addSales.id}`, response?.addSales)
  router.push(`/sales/${response?.addSales.id}`)
}

</script>

<style lang="scss" scoped></style>