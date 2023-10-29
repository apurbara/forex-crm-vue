<template>
    <v-text-field label="name" v-model="label.name" :rules="[label.isValidName()]"></v-text-field>
    <v-textarea label="description" v-model="label.description"></v-textarea>
</template>

<script lang="ts" setup>
import Label from './label';


defineProps<{ label: Label }>()
</script>

<style lang="scss" scoped></style>