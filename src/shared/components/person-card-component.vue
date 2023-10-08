<template>
  <div>
    <VCard class="pa-2" density="compact" :style="cursorStyle" :to="to">
      <VCardText class="position-relative">
        <!-- Title, Subtitle & Action Button -->
        <div class="d-flex justify-start flex-wrap">
          <VAvatar size="50" class="avatar-center mr-4" :image="person.avatar ?? 'https://i.pravatar.cc/100'" />
          <div>
            <VCardTitle class="pa-0">
              {{ person.name }}
            </VCardTitle>
            <VCardSubtitle class="text-caption pa-0">
              <slot name="subtitle"></slot>
            </VCardSubtitle>
          </div>
        </div>
        <slot></slot>
      </VCardText>
    </VCard>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{ person: { name?: string, avatar?: string }, to?: string }>()

const cursorStyle = computed(() => props.to ? 'cursor: pointer;' : 'cursor: default')
</script>

<style lang="scss" scoped></style>