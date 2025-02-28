<template>
  <AccountInfoCreateComponent :account-info="sales.accountInfo" />
  <v-select :items="salesRoleList" v-model="sales.role" label="role"></v-select>
  <!-- <v-autocomplete variant="outlined" :items="areaList" item-title="name" return-object
    @update:model-value="selectArea"></v-autocomplete> -->
</template>

<script setup lang="ts">
import AccountInfoCreateComponent from '@/shared-bc/domain/value-object/AccountInfoCreateComponent.vue';
import { onMounted } from 'vue';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { SalesRoleEnum } from '@/shared-bc/domain/enum/sales-role-enum';
import Sales from './sales';

const props = defineProps<{ sales: Sales }>()
const salesRoleList = Object.keys(SalesRoleEnum)
const { httpRequest, companyUserRepository } = useDependencyInjection()

onMounted(async () => {
  // const response = await companyUserRepository.getUser()
  //   .executeGraphqlQueryInCompany<{ allAreaList: AreaType[] }>(httpRequest, {
  //     operation: "allAreaList",
  //     variables: { filters: { type: "[FilterInput]", value: [{ column: "Area.disabled", value: false }] } },
  //     fields: ["id", "name"]
  //   })
  // areaList.value.push(...response.allAreaList)
  // console.log(areaList.value);
})

// const selectArea = (areaData: any) => { props.sales.loadArea(areaData) }

</script>

<style scoped></style>