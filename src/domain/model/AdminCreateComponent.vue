<template>
  <AccountInfoCreateComponent :account-info="admin.accountInfo" />
  <v-switch color="success" label="Super User" v-model="admin.aSuperUser" />
</template>

<script lang="ts" setup>
import AccountInfoCreateComponent from '../value-object/AccountInfoCreateComponent.vue';
import Admin from './admin';

const props = defineProps<{ admin: Admin }>()

</script>

<style lang="scss" scoped></style>