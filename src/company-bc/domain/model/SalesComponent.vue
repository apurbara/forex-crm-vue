<template>
  <AccountInfoComponent :account-info="sales.accountInfo" :readonly="readonly" />
  <v-select :items="salesTypeList" v-model="sales.type" label="type" :readonly="readonly" />
</template>

<script setup lang="ts">
import Sales from './sales';
import { SalesEnumType } from '@/shared-bc/domain/enum/sales-enum-type';
import AccountInfoComponent from '@/shared-bc/domain/value-object/AccountInfoComponent.vue';

defineProps<{ sales: Sales, readonly?: boolean }>()
const salesTypeList = Object.keys(SalesEnumType)

</script>

<style scoped></style>