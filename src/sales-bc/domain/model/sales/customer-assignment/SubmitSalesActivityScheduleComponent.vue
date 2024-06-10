<template>
  <div class="d-flex justify-space-between">
    <v-select label="select activity" :items="salesActivityList" item-title="name" return-object
      v-model="salesActivitySchedule.salesActivity" hide-details />
    <Calendar id="calendar-24h" v-model="salesActivitySchedule.startTime" showTime hourFormat="24" class="ml-4" />
  </div>
</template>

<script lang="ts" setup>
import Calendar from 'primevue/calendar';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, ref } from 'vue';
import { SalesActivityType } from '../../../dependency-model/sales-activity';
import SalesActivitySchedule from './salesActivitySchedule';

defineProps<{ salesActivitySchedule: SalesActivitySchedule }>()
const { httpRequest, companyUserRepository } = useDependencyInjection();
const salesActivityList = ref<SalesActivityType[]>([])

onMounted(async () => {
  const response = await companyUserRepository.getUser()
    .executeGraphqlQueryInCompany<{ salesActivityList: { list: SalesActivityType[] } }>(httpRequest, {
      operation: "salesActivityList",
      variables: { filters: { type: "[FilterInput]", value: [{ column: "SalesActivity.disabled", value: false }] } },
      fields: [{ list: ["id", "name"] }]
    })
  salesActivityList.value.push(...response.salesActivityList.list)
})

</script>

<style lang="scss" scoped></style>