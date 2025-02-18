<template>
  <div>
    <RecycleRequestComponent :recycle-request="recycleRequest" />
    <div class="flex justify-end">
      <Button label="submit" @click="submitRecycleRequest" :loading="submittingRecycleRequest" />
    </div>
  </div>
</template>

<script setup lang="ts">
import RecycleRequest, {
  RecycleRequestType,
} from "@/sales-bc/domain/model/sales/customer-assignment/recycle-request";
import RecycleRequestComponent from "@/sales-bc/domain/model/sales/customer-assignment/RecycleRequestComponent.vue";
import RecycleRequestService from "@/sales-bc/domain/service/recycle-request-service";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { reactive, ref } from "vue";

const props = defineProps<{ customerAssignmentId: string }>();
const emit = defineEmits<{ (e: "requestSubmitted", request: RecycleRequestType): void }>();
const recycleRequest = reactive(
  new RecycleRequest({ customerAssignment: { id: props.customerAssignmentId } })
);

const { salesRepository } = useDependencyInjection();
const recycleRequestService = new RecycleRequestService(salesRepository.getUser());

const submittingRecycleRequest = ref(false);
const submitRecycleRequest = async () => {
  submittingRecycleRequest.value = true;
  const response = await recycleRequestService.submitRecycleRequest(recycleRequest);
  submittingRecycleRequest.value = false;
  emit("requestSubmitted", response);
};
</script>

<style scoped></style>
