<template>
	<v-text-field ref="focus" label="Name" v-model="accountInfo.name" :rules="[accountInfo.isValidName()]" />
	<v-text-field label="Email" v-model="accountInfo.email" type="email" :rules="[accountInfo.isValidEmail()]" />
	<v-text-field label="Password" v-model="accountInfo.password" type="password"
		:rules="[accountInfo.isValidPassword()]" />
	<v-text-field label="Confirm Password" v-model="accountInfo.confirmPassword" type="password"
		:rules="[accountInfo.isValidConfirmPassword()]" />
</template>

<script lang="ts" setup>
import AccountInfo from './account-info';
import useFocus from '@/resources/composables/focus';

const props = defineProps<{ accountInfo: AccountInfo }>()
const { focus } = useFocus();

</script>

<style lang="scss" scoped></style>