<template>
  <v-text-field ref="focus" label="Name" v-model="customer.name" :rules="[customer.isValidName()]" />
  <v-text-field label="email" v-model="customer.email" :rules="[customer.isValidEmail()]" />
  <v-select :items="areaList" item-title="name" return-object @update:model-value="selectArea"></v-select>
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
    .executeGraphqlQueryInCompany<{ areaList: { list: AreaType[] } }>(httpRequest, {
      operation: "areaList",
      variables: { filters: { type: "[FilterInput]", value: [{ column: "Area.disabled", value: false }] } },
      fields: [{ list: ["id", "name"] }]
    })
  areaList.value.push(...response.areaList.list)
})

const selectArea = (areaData: any) => { props.customer.loadArea(areaData) }

</script>

<style lang="scss" scoped></style>