<template>
  <div>
    <LayoutComponent :layout="layout">
      <div class="pa-4">
        <router-view></router-view>
      </div>
    </LayoutComponent>
  </div>
</template>

<script lang="ts" setup>
import UserRepository from '@/domain/user-repository';
import LayoutComponent from '@/resources/components/LayoutComponent.vue';
import { computed } from 'vue';
import { inject } from 'vue';

const userRepository = inject<UserRepository>('userRepository');
const layout = computed(() => userRepository?.getUserLayout()!);
</script>

<style lang="scss" scoped></style>