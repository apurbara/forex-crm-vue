<template>
  <div class="flex flex-col gap-10 mt-4">
    <FloatLabel>
      <label for="transaction_value">Jumlah Transaksi</label>
      <InputNumber
        v-model="closingRequest.transactionValue"
        inputId="transaction_value"
        mode="currency"
        currency="IDR"
        locale="id-ID"
        :invalid="closingRequest.isValidTransactionValue() !== true"
        fluid
      />
    </FloatLabel>
    <FloatLabel>
      <label for="note">Note</label>
      <Textarea v-model="closingRequest.note" rows="5" inputId="note" fluid />
    </FloatLabel>
  </div>
</template>

<script lang="ts" setup>
import ClosingRequest from "./closing-request";

defineProps<{ closingRequest: ClosingRequest }>();
</script>

<style lang="scss" scoped></style>
