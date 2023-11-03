<template>
  <v-text-field label="transaction value" v-model="closingRequest.transactionValue" type="number" />
  <v-textarea label="note" v-model="closingRequest.note"></v-textarea>
</template>

<script lang="ts" setup>
import ClosingRequest from './closing-request';


const props = defineProps<{ closingRequest: ClosingRequest }>()
</script>

<style lang="scss" scoped></style>