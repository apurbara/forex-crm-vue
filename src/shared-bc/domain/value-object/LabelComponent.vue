<template>
    <v-text-field label="name" v-model="label.name" :readonly="readonly" :rules="[label.isValidName()]" />
    <v-textarea label="description" v-model="label.description" :readonly="readonly" />
</template>

<script lang="ts" setup>
import Label from './label';

defineProps<{ label: Label, readonly?: boolean }>()
</script>

<style lang="scss" scoped></style>