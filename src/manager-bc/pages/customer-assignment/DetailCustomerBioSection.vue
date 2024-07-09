<template>
  <section class="page-section ma-2">
    <div class="d-flex align-center justify-start flex-wrap">
      <InfoComponentIcon style="min-width: 40%;"
        :info="{ value: customerAssignment.customer?.phone, icon: `mdi-phone-classic` }" />
      <InfoComponentIcon style="min-width: 40%;"
        :info="{ value: customerAssignment.customerJourney?.name, icon: `mdi-progress-star` }" />
      <InfoComponentIcon style="min-width: 40%;"
        :info="{ value: customerAssignment.customer?.email, icon: `mdi-email-outline` }" />
      <InfoComponentIcon style="min-width: 40%;"
        :info="{ value: customerAssignment.customer?.city?.name, icon: `mdi-map-marker-outline` }" />
    </div>
  </section>
</template>

<script setup lang="ts">
import InfoComponentIcon from '@/shared/components/info-componentIcon.vue';
import { CustomerAssignmentType } from '@/manager-bc/domain/model/manager/sales/customer-assignment';

defineProps<{ customerAssignment: CustomerAssignmentType }>();

</script>

<style scoped></style>