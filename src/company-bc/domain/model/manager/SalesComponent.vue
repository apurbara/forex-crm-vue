<template>
  <AccountInfoComponent :account-info="sales.accountInfo" :readonly="readonly" />
  <v-select :items="salesRoleList" v-model="sales.role" label="type" :readonly="readonly" />
</template>

<script setup lang="ts">
import Sales from './sales';
import { SalesRoleEnum } from '@/shared-bc/domain/enum/sales-role-enum';
import AccountInfoComponent from '@/shared-bc/domain/value-object/AccountInfoComponent.vue';

defineProps<{ sales: Sales, readonly?: boolean }>()
const salesRoleList = Object.keys(SalesRoleEnum)

</script>

<style scoped></style>