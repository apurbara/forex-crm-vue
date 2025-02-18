<template>
  <div class="flex justify-start gap-2 align-center">
    <Button
      v-if="detailPath"
      class="!m-0 !p-2 !text-xs"
      as="router-link"
      severity="secondary"
      icon="pi pi-eye"
      label="Detail"
      :to="detailPath"
    />
    <Button
      v-if="value"
      class="!p-0 !m-0 !text-2xl"
      severity="danger"
      variant="text"
      icon="mdi mdi-toggle-switch-off-outline"
      :disabled="!enableCallback"
      @click="enableConfirmation($event)"
    />
    <Button
      v-else
      class="!p-0 !m-0 !text-2xl"
      severity="success"
      variant="text"
      icon="mdi mdi-toggle-switch-outline"
      :disabled="!disableCallback"
      @click="disableConfirmation($event)"
    />
  </div>
</template>

<script setup lang="ts">
import { useConfirm } from "primevue";

const props = defineProps<{
  value?: boolean;
  disableCallback?: () => Promise<void>;
  disableMessage?: string;
  enableCallback?: () => Promise<void>;
  enableMessage?: string;
  detailPath?: string;
}>();
const confirm = useConfirm();

const enableConfirmation = (event: Event) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: props.enableMessage ?? "Do you really want to enable record?",
    icon: "pi pi-question-circle",
    acceptClass: "p-button-success",
    accept: props.enableCallback,
    rejectClass: "p-button-secondary",
    reject: () => {},
  });
};
const disableConfirmation = (event: Event) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: props.disableMessage ?? "Do you really want to disable record?",
    icon: "pi pi-exclamation-triangle",
    acceptClass: "p-button-danger",
    accept: props.disableCallback,
    rejectClass: "p-button-secondary",
    reject: () => {},
  });
};
</script>

<style scoped></style>
