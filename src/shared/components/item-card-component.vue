<template>
  <div>
    <v-card density="comfortable" :style="cursorStyle" :to="to">
      <v-img :src="item.image ?? 'https://picsum.photos/200/100'" height="100px" cover></v-img>
      <v-card-text class="position-relative">
        <!-- Title, Subtitle & Action Button -->
        <div class="d-flex justify-space-between flex-wrap">
          <div>
            <v-card-title class="pa-0">
              {{ item.name }}
            </v-card-title>
            <v-card-subtitle class="text-caption pa-0">
              {{ item.description }}
              <slot name="subtitle"></slot>
            </v-card-subtitle>
          </div>
        </div>
        <slot></slot>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{ item: { name?: string, description?: string, image?: string }, to?: string }>()

const cursorStyle = computed(() => props.to ? 'cursor: pointer;' : 'cursor: default')
</script>

<style lang="scss" scoped></style>