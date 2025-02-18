<template>
  <div>
    <ClosingRequestComponent :closing-request="closingRequest" />
          <v-btn @click="submitClosingRequest" class="ml-4">Submit</v-btn>
  </div>
</template>

<script setup lang="ts">
import CustomerAssignment from "@/sales-bc/domain/model/sales/customer-assignment";

const props = defineProps<{ cutomerAssignment: CustomerAssignment }>();
</script>

<style scoped></style>
