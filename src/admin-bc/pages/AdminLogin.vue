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
import AdminRole, { AdminRoleType } from '../role/admin-role';

const { httpRequest, companyUserRepository, adminRepository } = useDependencyInjection();
const loginPayload = reactive(new LoginPayload());

const login = async () => {
  const response = await httpRequest.mutate<{ login: AdminRoleType }>('admin', {
    operation: 'login',
    variables: loginPayload.toGraphqlVariable(),
    fields: ['token', 'name', 'aSuperUser']
  })
  const adminData: AdminRoleType = { ...response.login, type: AdminRole.type }
  adminRepository.logUserIn(adminData)
  companyUserRepository.logUserIn(adminData)
}

</script>

<style scoped></style>