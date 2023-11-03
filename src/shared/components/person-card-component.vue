<template>
  <div>
    <v-card class="pa-2 person-card" density="compact" :style="cursorStyle" :to="to">
      <div class="d-flex justify-start align-center">
        <v-avatar size="50" class="avatar-center mr-4" :image="person.avatar ?? 'https://i.pravatar.cc/100'" />
        <div>
          <v-card-item>
            <v-card-title class="pa-0">
              {{ person.name }}
            </v-card-title>
            <v-card-subtitle class="text-caption pa-0" v-if="person.bio">
              {{ person.bio }}
            </v-card-subtitle>
          </v-card-item>
          <v-card-text>
            <slot></slot>
          </v-card-text>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{ person: { name: string, avatar?: string, bio?: string }, to?: string }>()

const cursorStyle = computed(() => props.to ? 'cursor: pointer;' : 'cursor: default')
</script>

<style lang="scss" scoped>
.person-card {
  min-width: 300px;
}
</style>