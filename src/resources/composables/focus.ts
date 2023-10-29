import { onMounted, ref } from "vue";

export default function useFocus() {
  const focus = ref(null);
  onMounted(() => focus.value.focus());

  return { focus };
}
