<template>
  <v-text-field label="transaction value" v-model="closingRequest.transactionValue" v-maska="options"
    data-maska-reversed />
  <v-textarea label="note" v-model="closingRequest.note"></v-textarea>
</template>

<script lang="ts" setup>
import { vMaska } from "maska/vue";
import ClosingRequest from './closing-request';
import { reactive } from "vue";
import { MaskInputOptions } from "maska";

const props = defineProps<{ closingRequest: ClosingRequest }>()

const options = reactive<MaskInputOptions>({
  mask: '9.99#',
  tokens: {
    9: { pattern: /[0-9]/, repeated: true },
  },
  reversed: true
})

</script>

<style lang="scss" scoped></style>