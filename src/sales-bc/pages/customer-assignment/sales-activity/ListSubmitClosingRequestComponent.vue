<template>
  <div>
    <ClosingRequestComponent :closing-request="closingRequest" />
    <div class="flex justify-end">
      <Button
        label="submit"
        @click="submitClosingRequest"
        :loading="submittingClosingRequest"
        :disabled="!closingRequest.isValidToSubmit()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ClosingRequest, {
  ClosingRequestType,
} from "@/sales-bc/domain/model/sales/customer-assignment/closing-request";
import ClosingRequestComponent from "@/sales-bc/domain/model/sales/customer-assignment/ClosingRequestComponent.vue";
import ClosingRequestService from "@/sales-bc/domain/service/closing-request-service";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { reactive, ref } from "vue";

const props = defineProps<{ customerAssignmentId: string }>();
const emit = defineEmits<{ (e: "requestSubmitted", request: ClosingRequestType): void }>();
const closingRequest = reactive(
  new ClosingRequest({ customerAssignment: { id: props.customerAssignmentId } })
);

const { salesRepository } = useDependencyInjection();
const closingRequestService = new ClosingRequestService(salesRepository.getUser());

const submittingClosingRequest = ref(false);
const submitClosingRequest = async () => {
  submittingClosingRequest.value = true;
  const response = await closingRequestService.submitClosingRequest(closingRequest);
  submittingClosingRequest.value = false;
  emit("requestSubmitted", response);
};
</script>

<style scoped></style>
