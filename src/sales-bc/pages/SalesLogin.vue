<template>
  <LoginComponent :login-payload="loginPayload" />
  <v-divider />
  <v-btn :disabled="!loginPayload.isValidLoginPayload()" block @click="login" variant="elevated" color="primary">
    Login
  </v-btn>
</template>

<script setup lang="ts">
import LoginPayload from '@/shared-bc/domain/value-object/login-payload';
import LoginComponent from '@/shared-bc/domain/value-object/LoginComponent.vue';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { reactive } from 'vue';
import SalesRole, { SalesRoleType } from '../role/sales-role';

const { httpRequest, companyUserRepository, salesRepository } = useDependencyInjection();
const loginPayload = reactive(new LoginPayload());

const login = async () => {
  const response = await httpRequest.mutate<{ login: SalesRoleType }>('sales', {
    operation: 'login',
    variables: loginPayload.toGraphqlVariable(),
    fields: ['token', 'name', 'role']
  })
  const salesData: SalesRoleType = { ...response.login, type: SalesRole.type }
  salesRepository.logUserIn(salesData)
  companyUserRepository.logUserIn(salesData)
}

</script>

<style scoped></style>