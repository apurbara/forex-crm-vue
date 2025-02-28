<template>
  <AccountInfoComponent :account-info="manager.accountInfo" :readonly="readonly" />
</template>

<script setup lang="ts">
import AccountInfoComponent from '@/shared-bc/domain/value-object/AccountInfoComponent.vue';
import Manager from './manager';

defineProps<{ manager: Manager, readonly?: boolean }>()

</script>

<style scoped></style>