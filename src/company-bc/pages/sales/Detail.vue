<template>
  <div>
    <h1 class="page-title">Sales Detail</h1>
    <div class="d-flex justify-end">
    </div>
    <div class="form">
      <div class="d-flex justify-end">
        <v-btn variant="tonal" v-if="!editing" @click="editing = !editing">Edit</v-btn>
        <v-btn variant="tonal" v-else @click="cancelEdit">Cancel</v-btn>
      </div>
      <AccountInfoComponent :account-info="sales.accountInfo" :readonly="true" />
      <v-select :items="salesRoleList" v-model="sales.role" label="role" :readonly="!editing" />
      <v-autocomplete label="manager" variant="outlined" :items="managerList" density="compact" item-title="name"
        return-object v-model="sales.manager" :readonly="!editing" />
      <div class="d-flex justify-end" v-if="editing">
        <v-btn :disabled="!sales.isValidToUpdate()" @click="update">Update</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ManagerType } from '@/company-bc/domain/model/manager';
import Sales, { SalesType } from '@/company-bc/domain/model/manager/sales';
import { SalesRoleEnum } from '@/shared-bc/domain/enum/sales-role-enum';
import AccountInfoComponent from '@/shared-bc/domain/value-object/AccountInfoComponent.vue';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, reactive, ref } from 'vue';

const { companyUserRepository, cache } = useDependencyInjection();

const sales = reactive(new Sales())
const props = defineProps<{ salesId: string }>()
const managerList = ref<ManagerType[]>([])
let cacheData: SalesType;
const salesRoleList = Object.keys(SalesRoleEnum)

onMounted(async () => {
  cacheData = cache?.pull<SalesType>(`sales-${props.salesId}`);
  if (cacheData) {
    sales.load(cacheData);
  } else {
    const response = await companyUserRepository.getUser()!
      .executeGraphqlQueryInCompany<{ viewSalesDetail: SalesType }>({
        operation: 'viewSalesDetail',
        variables: { id: { type: 'ID!', value: props.salesId } },
        fields: [
          'id', 'contractTerminated', 'createdTime', 'contractTerminatedTime', 'name', 'email', 'role',
          { manager: ["id", "name"] }
        ],
      })
    cacheData = response.viewSalesDetail
    sales.load(cacheData)
  }

  const managerListReponse = await companyUserRepository.getUser()!.executeGraphqlQueryInCompany<{ viewAllManager: ManagerType[] }>({
    operation: "viewAllManager",
    variables: { filters: { type: "[FilterInput]", value: [{ column: "Manager.suspended", value: false }] } },
    fields: ["id", "name"],
  })
  managerList.value = managerListReponse.viewAllManager
})

let editing = ref(false)
const cancelEdit = () => {
  sales.load(cacheData)
  editing.value = false;
}
const update = async () => {
  const response = await companyUserRepository.getUser()!
    .executeGraphqlMutationInCompany<{ updateSales: SalesType }>({
      operation: "updateSales",
      variables: { ...sales.toGraphqlVariables(), name: undefined, email: undefined, password: undefined },
      fields: [
        'type',
        { manager: ["id", "name"] }
      ],
    })
  sales.load(response.updateSales)
  cacheData = { ...cacheData, ...response.updateSales }
  editing.value = false
}

</script>

<style lang="scss" scoped></style>