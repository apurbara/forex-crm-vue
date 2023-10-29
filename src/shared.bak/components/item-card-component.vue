<template>
  <div>
    <VCard density="compact" :style="cursorStyle" :to="to">
      <v-img :src="item.image ?? 'https://picsum.photos/200/100'" height="100px" cover></v-img>
      <VCardText class="position-relative">
        <!-- Title, Subtitle & Action Button -->
        <div class="d-flex justify-space-between flex-wrap">
          <div>
            <VCardTitle class="pa-0">
              {{ item.name }}
            </VCardTitle>
            <VCardSubtitle class="text-caption pa-0">
              {{ item.description }}
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

const props = defineProps<{ item: { name?: string, description?: string, image?: string }, to: string }>()

const cursorStyle = computed(() => props.to ? 'cursor: pointer;' : 'cursor: default')
</script>

<style lang="scss" scoped></style>