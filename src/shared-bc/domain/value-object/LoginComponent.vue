<template>
	<v-text-field ref="focus" v-model="loginPayload.email" label="Email" :rules="[loginPayload.isValidEmail()]" />
	<v-text-field v-model="loginPayload.password" label="Password" type="password"
		:rules="[loginPayload.isValidPassword()]" />
</template>

<script lang="ts" setup>
import LoginPayload from './login-payload';

defineProps<{ loginPayload: LoginPayload }>()

</script>

<style lang="scss" scoped></style>