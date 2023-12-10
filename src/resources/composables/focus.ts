import { onMounted, ref } from "vue";

export default function useFocus() {
  const focus = ref<HTMLElement | null>(null);
  onMounted(() => focus.value?.focus());

  return { focus };
}
