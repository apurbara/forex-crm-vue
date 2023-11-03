<script lang="ts" setup>
import LoginPayload from '@/domain/user-role/login-payload';
import { reactive, ref, onMounted } from 'vue';
import { UserRoleInterface } from '@/domain/user-role/role-interfaces';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import useFocus from '@/resources/composables/focus';
import PersonnelRole, { PersonnelRoleType } from '@/domain/user-role/personnel-role';

const loginPayload = reactive(new LoginPayload());

const { httpRequest, userRepository } = useDependencyInjection()
const { focus } = useFocus()

const login = async () => {
  const response = await userRepository.getUser<UserRoleInterface>()
    .executeGraphqlMutation<{ personnelLogin: PersonnelRoleType }>(httpRequest, {
      operation: 'personnelLogin',
      variables: loginPayload.toGraphqlVariable(),
      fields: [
        'token', 'name', 'id',
        {
          operation: "salesAssignments",
          variables: { filters: { type: "[FilterInput]", value: [{ column: "Sales.disabled", value: false }] } },
          fields: [{ list: ['id'] }],
          // fields: CursorPagination.wrapResultFields(["id", "createdTime", { area: ["name"] }, { manager: [{ personnel: ["name"] }] }]),
        }
      ]
    });
  const personnelRoleData = response.personnelLogin;
  const personnel = new PersonnelRole(personnelRoleData);
  const salesAssignments = personnelRoleData.salesAssignments?.list ?? [];
  if (salesAssignments.length > 0) {
    userRepository.logUserIn(personnel.authorizeAsSales(salesAssignments[0]));
  } else {
    userRepository.logUserIn(personnel);
  }
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