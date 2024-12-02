<template>
  <v-rating disabled :length="3" :size="32" :model-value="customer.rating" active-color="primary" />
  <InfoComponentIcon style="min-width: 40%;" :info="{ value: customer.phone, icon: `mdi-phone-classic` }" />
  <InfoComponentIcon style="min-width: 40%;" :info="{ value: customer.email, icon: `mdi-email-outline` }" />
  <InfoComponentIcon style="min-width: 40%;" :info="{ value: customer.city?.name, icon: `mdi-map-marker-outline` }" />
  <InfoComponentIcon style="min-width: 40%;" :info="{ value: customer.source, icon: `mdi-account-group-outline` }" />
</template>

<script setup lang="ts">
import { CustomerType } from '@/company-bc/domain/model/customer';
import InfoComponentIcon from '@/shared/components/info-componentIcon.vue';

const props = defineProps<{ customer: CustomerType }>();

</script>

<style lang="scss" scoped></style>