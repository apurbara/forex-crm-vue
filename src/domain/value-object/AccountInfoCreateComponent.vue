<template>
    <v-row>
        <v-col cols="12" md="6"><v-text-field ref="focus" label="Name" v-model="accountInfo.name"
                :rules="[accountInfo.isValidName()]" /></v-col>
        <v-col cols="12" md="6"><v-text-field label="Email" v-model="accountInfo.email"
                :rules="[accountInfo.isValidEmail()]" /></v-col>
        <v-col cols="12" md="6"><v-text-field label="Password" v-model="accountInfo.password"
                :rules="[accountInfo.isValidPassword()]" type="password" /></v-col>
        <v-col cols="12" md="6"><v-text-field label="Confirm Password" v-model="accountInfo.confirmPassword" type="password"
                :rules="[accountInfo.isValidConfirmPassword()]" /></v-col>
    </v-row>
</template>

<script lang="ts" setup>
import AccountInfo from './account-info';
import useFocus from '@/resources/composables/focus';

const props = defineProps<{ accountInfo: AccountInfo }>()
const {focus} = useFocus();

</script>

<style lang="scss" scoped></style>