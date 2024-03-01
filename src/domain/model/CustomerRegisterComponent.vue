<template>
  <v-text-field ref="focus" label="Name" v-model="customer.name" :rules="[customer.isValidName()]" />
  <v-text-field label="email" v-model="customer.email" :rules="[customer.isValidEmail()]" />
  <v-text-field label="phone" v-model="customer.phone" :rules="[customer.isValidPhone()]" />
  <v-autocomplete variant="outlined" :items="areaList" item-title="name" return-object @update:model-value="selectArea"></v-autocomplete>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import Customer from './customer';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { ref } from 'vue';
import { AreaType } from './area-structure/area';
import { CompanyUserRoleInterface } from '../user-role/role-interfaces';
import useFocus from '@/resources/composables/focus';

const props = defineProps<{ customer: Customer }>()
const areaList = ref<AreaType[]>([]);
const { httpRequest, userRepository } = useDependencyInjection()
const { focus } = useFocus();

onMounted(async () => {
  const response = await userRepository.getUser<CompanyUserRoleInterface>()
    .executeGraphqlQueryInCompany<{ allAreaList: AreaType[] }>(httpRequest, {
      operation: "allAreaList",
      variables: { filters: { type: "[FilterInput]", value: [{ column: "Area.disabled", value: false }] } },
      fields: ["id", "name"]
    })
  areaList.value.push(...response.allAreaList)
// console.log(areaList.value);
})

const selectArea = (areaData: any) => { props.customer.loadArea(areaData) }

</script>

<style lang="scss" scoped></style>