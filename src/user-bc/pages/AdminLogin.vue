<template>
	<div class="content login-page d-flex justify-space-around">
		<v-card class="login-card pa-4 mt-12 form" width="400px">
			<v-card-title class="d-flex justify-space-around">
				Login To Continue
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

<script lang="ts" setup>
import { reactive } from 'vue';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import useFocus from '@/resources/composables/focus';
import { useRouter } from 'vue-router';
import LoginPayload from './login-payload';
import AdminRole, { AdminRoleType } from '../role/admin-role';

const loginPayload = reactive(new LoginPayload());

const { httpRequest, userRepository, companyUserRepository } = useDependencyInjection();
const { focus } = useFocus();
const router = useRouter();

const login = async () => {
	const response = await userRepository
		.getUser()
		.executeGraphqlMutation<{ adminLogin: AdminRoleType }>(httpRequest, {
			operation: 'adminLogin',
			variables: loginPayload.toGraphqlVariable(),
			fields: ['token', 'name', 'aSuperUser'],
		});
	const adminData = { ...response.adminLogin, type: AdminRole.type };
	userRepository.logUserIn(adminData)
	companyUserRepository.logUserIn(adminData)
}
</script>

<style lang="scss" scoped></style>