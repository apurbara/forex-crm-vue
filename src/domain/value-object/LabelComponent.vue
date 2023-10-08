<template>
  <div>
    <v-text-field label="name" v-model="label.name"></v-text-field>
    <v-text-field label="description" v-model="label.description"></v-text-field>
  </div>
</template>

<script lang="ts" setup>
import { Label } from '@/domain/value-object/label';

defineProps<{ label: Label }>()
</script>

<style lang="scss" scoped></style>