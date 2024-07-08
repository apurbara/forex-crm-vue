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
import ManagerRole, { ManagerRoleType } from '../role/manager-role';

const { httpRequest, companyUserRepository, managerRepository } = useDependencyInjection();
const loginPayload = reactive(new LoginPayload());

const login = async () => {
  const response = await httpRequest.mutate<{ login: ManagerRoleType }>('manager', {
    operation: 'login',
    variables: loginPayload.toGraphqlVariable(),
    fields: ['token', 'name']
  })
  const managerData: ManagerRoleType = { ...response.login, type: ManagerRole.type }
  managerRepository.logUserIn(managerData)
  companyUserRepository.logUserIn(managerData)
}

</script>

<style scoped></style>