<template>
  <AccountInfoCreateComponent :account-info="personnel.accountInfo" />
</template>

<script lang="ts" setup>
import AccountInfoCreateComponent from '../value-object/AccountInfoCreateComponent.vue';
import Personnel from './personnel';

const props = defineProps<{ personnel: Personnel }>()

</script>

<style lang="scss" scoped></style>