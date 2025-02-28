<template>
  <AccountInfoCreateComponent :account-info="manager.accountInfo" />
</template>

<script setup lang="ts">
import AccountInfoCreateComponent from '@/shared-bc/domain/value-object/AccountInfoCreateComponent.vue';
import Manager from './manager';

defineProps<{ manager: Manager }>()

</script>

<style scoped></style>