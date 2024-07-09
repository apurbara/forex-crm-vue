<script setup lang="ts">
import { CurrencyDisplay, useCurrencyInput } from 'vue-currency-input';
import { watch } from 'vue';

const props = withDefaults(defineProps<{ modelValue?: number | null, label?: string, readonly?: boolean }>(), { modelValue: null });

const { inputRef, formattedValue, setValue } = useCurrencyInput({
  currency: 'IDR',
  currencyDisplay: CurrencyDisplay.hidden,
  hideCurrencySymbolOnFocus: false,
  hideGroupingSeparatorOnFocus: false,
  precision: 0,
  valueRange: { min: 0 },
});

watch(
  () => props.modelValue,
  (value) => {
    console.log(value);
    setValue(value);
  }
);
</script>

<template>
  <v-text-field v-model="formattedValue" :label="label" :readonly="readonly" ref="inputRef">
  </v-text-field>
</template>