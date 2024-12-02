<template>
  <div>
    <InfoComponentIcon style="min-width: 40%;" :info="{ value: customer.phone, icon: `mdi-phone-classic` }" />
    <InfoComponentIcon style="min-width: 40%;" :info="{ value: customer.email, icon: `mdi-email-outline` }" />
    <InfoComponentIcon style="min-width: 40%;" :info="{ value: customer.city?.name, icon: `mdi-map-marker-outline` }" />
  </div>
</template>

<script setup lang="ts">
import InfoComponentIcon from '@/shared/components/info-componentIcon.vue';
import Customer from './customer';

const props = defineProps<{ customer: Customer }>();

</script>

<style scoped></style>