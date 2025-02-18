<template>
  <div>
    <SubmitSalesActivityScheduleComponent :sales-activity-schedule="salesActivitySchedule" />
    <div class="flex justify-end mt-4">
      <Button @click="submitNewSchedule" label="Submit" :loading="submittingNewSchedule" />
    </div>
  </div>
</template>

<script setup lang="ts">
import CustomerAssignment from "@/sales-bc/domain/model/sales/customer-assignment";
import SalesActivitySchedule, {
  SalesActivityScheduleType,
} from "@/sales-bc/domain/model/sales/customer-assignment/salesActivitySchedule";
import SubmitSalesActivityScheduleComponent from "@/sales-bc/domain/model/sales/customer-assignment/SubmitSalesActivityScheduleComponent.vue";
import SalesActivityScheduleService from "@/sales-bc/domain/service/sales-activity-schedule-service";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { reactive, ref } from "vue";

const props = defineProps<{ customerAssignmentId: string }>();
const emit = defineEmits<{(e: "scheduleSubmitted", schedule: SalesActivityScheduleType): void}>();

const salesActivitySchedule = reactive(new SalesActivitySchedule());
salesActivitySchedule.customerAssignment = new CustomerAssignment({
  id: props.customerAssignmentId,
});
const { salesRepository } = useDependencyInjection();
const salesActivityScheduleService = new SalesActivityScheduleService(salesRepository.getUser());

const submittingNewSchedule = ref<boolean>(false);
const submitNewSchedule = async () => {
  submittingNewSchedule.value = true;
  const response = await salesActivityScheduleService.submitSalesActivitySchedule(
    salesActivitySchedule
  );
  submittingNewSchedule.value = false;
  emit("scheduleSubmitted", response);
};
</script>

<style scoped></style>
