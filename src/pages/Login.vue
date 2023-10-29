<script lang="ts" setup>
import { useRouter } from 'vue-router';
import LoginPayload from '@/domain/user-role/login-payload';
import { reactive, ref, onMounted } from 'vue';
import { UserRoleDataType, UserRoleInterface } from '@/domain/user-role/role-interfaces';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import useFocus from '@/resources/composables/focus';
import Personnel from '@/domain/user-role/personnel';

const loginPayload = reactive(new LoginPayload());

const { httpRequest, userRepository } = useDependencyInjection()
const { focus } = useFocus()

const login = async () => {
  const response = await userRepository.getUser<UserRoleInterface>().executeGraphqlMutation<{ personnelLogin: UserRoleDataType }>(httpRequest, {
    operation: 'personnelLogin',
    variables: loginPayload,
    fields: ['token', 'name', 'activeSales']
  });
  userRepository.logUserIn(new Personnel(response.personnelLogin));
  useRouter().push("/personnel-dashboard");
}
</script>
    
<template>
  <div class="content login-page d-flex justify-space-around">
    <v-card class="login-card pa-4 mt-12 form" width="400px">
      <v-card-title class="d-flex justify-space-around">
        <v-title>Login To Continue</v-title>
      </v-card-title>
      <v-card-item>
        <v-text-field ref="focus" v-model="loginPayload.email" label="Email" :rules="[loginPayload.isValidEmail()]" />
        <v-text-field v-model="loginPayload.password" label="Password" type="password"
          :rules="[loginPayload.isValidPassword()]" />
      </v-card-item>
      <v-divider />
      <v-card-actions>
        <v-btn :disabled="!loginPayload.isValidLoginPayload()" block @click="login" variant="elevated" color="primary">
          Login
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style lang="scss" scoped></style>