<template>
	<v-text-field ref="focus" label="Name" v-model="accountInfo.name" :rules="[accountInfo.isValidName()]"
		:readonly="readonly" />
	<v-text-field label="Email" v-model="accountInfo.email" type="email" :rules="[accountInfo.isValidEmail()]"
		:readonly="readonly" />
</template>

<script lang="ts" setup>
import AccountInfo from './account-info';
import useFocus from '@/resources/composables/focus';

const props = defineProps<{ accountInfo: AccountInfo, readonly?: boolean }>()
const { focus } = useFocus();

</script>

<style lang="scss" scoped></style>