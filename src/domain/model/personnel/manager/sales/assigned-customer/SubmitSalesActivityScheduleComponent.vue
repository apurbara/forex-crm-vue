<template>
  <div class="d-flex justify-space-between">
    <v-select label="select activity" class="mx-2" :items="salesActivityList" item-title="name" return-object
      @update:model-value="selectSalesActivity" hide-details></v-select>
    <Calendar id="calendar-24h" v-model="salesActivitySchedule.startTime" showTime hourFormat="24" />
  </div>
</template>

<script lang="ts" setup>
import Calendar from 'primevue/calendar';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { CompanyUserRoleInterface } from '@/domain/user-role/role-interfaces';
import SalesActivitySchedule from './sales-activity-schedule';
import { SalesActivityType } from '@/domain/model/sales-activity';

const props = defineProps<{ salesActivitySchedule: SalesActivitySchedule }>()
const { httpRequest, userRepository } = useDependencyInjection();
const salesActivityList = ref<SalesActivityType[]>([])

onMounted(async () => {
  const response = await userRepository.getUser<CompanyUserRoleInterface>()
    .executeGraphqlQueryInCompany<{ salesActivityList: { list: SalesActivityType[] } }>(httpRequest, {
      operation: "salesActivityList",
      variables: { filters: { type: "[FilterInput]", value: [{ column: "SalesActivity.disabled", value: false }] } },
      fields: [{ list: ["id", "name"] }]
    })
  salesActivityList.value.push(...response.salesActivityList.list)
})

const selectSalesActivity = (salesActivityData: any) => { props.salesActivitySchedule.selectSalesActity(salesActivityData) }
</script>

<style lang="scss" scoped></style>