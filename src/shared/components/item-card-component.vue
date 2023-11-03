<template>
  <div>
    <v-card density="comfortable" :style="cursorStyle" :to="to">
      <v-img :src="item.image ?? 'https://picsum.photos/200/100'" height="100px" cover v-if="item.image"></v-img>
      <v-card-item class="position-relative">
        <!-- Title, Subtitle & Action Button -->
        <v-card-title class="pa-0">
          {{ item.name }}
        </v-card-title>
        <v-card-subtitle class="text-caption pa-0">
          {{ item.description }}
          <slot name="subtitle"></slot>
        </v-card-subtitle>
      </v-card-item>
      <v-card-text>
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