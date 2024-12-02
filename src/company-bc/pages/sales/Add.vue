<template>
  <div>
    <h1 class="page-title">Add Sales</h1>
    <div class="form">
      <SalesCreateComponent :sales="sales" />
      <v-autocomplete label="manager" variant="outlined" :items="managerList" density="compact" item-title="name"
        return-object v-model="sales.manager" />
      <div class="d-flex justify-end">
        <v-btn :disabled="!sales.isValidToCreate()" @click="submit">Submit</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ManagerType } from '@/company-bc/domain/model/manager';
import Sales, { SalesType } from '@/company-bc/domain/model/manager/sales';
import SalesCreateComponent from '@/company-bc/domain/model/manager/SalesCreateComponent.vue';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const sales = reactive(new Sales());
const managerList = ref<ManagerType[]>([])

const { companyUserRepository, cache } = useDependencyInjection()
const router = useRouter()

onMounted(async () => {
  const response = await companyUserRepository.getUser()!.executeGraphqlQueryInCompany<{ viewAllManager: ManagerType[] }>({
    operation: "viewAllManager",
    variables: { filters: { type: "[FilterInput]", value: [{ column: "Manager.suspended", value: false }] } },
    fields: ["id", "name"],
  })
  managerList.value = response.viewAllManager
})

const submit = async () => {
  const response = await companyUserRepository.getUser()!
    .executeGraphqlMutationInCompany<{ addSales: SalesType }>({
      operation: 'addSales',
      variables: sales.toGraphqlVariables(),
      fields: [
        'id', 'contractTerminated', 'createdTime', 'contractTerminatedTime', 'name', 'email', 'role',
        { manager: ["id", "name"] }
      ]
    })
  cache?.set(`sales-${response?.addSales.id}`, response?.addSales)
  router.push(`/sales/${response?.addSales.id}`)
}

</script>

<style lang="scss" scoped></style>