<template>
  <AccountInfoCreateComponent :account-info="sales.accountInfo" />
  <v-select :items="salesTypeList" v-model="sales.type" label="type"></v-select>
  <!-- <v-autocomplete variant="outlined" :items="areaList" item-title="name" return-object
    @update:model-value="selectArea"></v-autocomplete> -->
</template>

<script setup lang="ts">
import AccountInfoCreateComponent from '@/shared-bc/domain/value-object/AccountInfoCreateComponent.vue';
import Sales from './sales';
import { onMounted } from 'vue';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
// import { AreaType } from './area-structure/area';
import { SalesEnumType } from '@/shared-bc/domain/enum/sales-enum-type';

const props = defineProps<{ sales: Sales }>()
const salesTypeList = Object.keys(SalesEnumType)
// const areaList = ref<AreaType[]>([]);
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

const selectArea = (areaData: any) => { props.sales.loadArea(areaData) }

</script>

<style scoped></style>