<template>
  <div>
    <LayoutComponent :layout="layout">
      <div class="content">
        <Toast></Toast>
        <ConfirmPopup class="elevation-1"></ConfirmPopup>
        <router-view></router-view>
      </div>
    </LayoutComponent>
  </div>
</template>

<script lang="ts" setup>
import LayoutComponent from '@/resources/components/LayoutComponent.vue';
import { computed } from 'vue';
import { inject } from 'vue';
import { useDependencyInjection } from '../composables/dependency-injection';

const { userRepository } = useDependencyInjection()

const layout = computed(() => userRepository?.getUser().getLayout(userRepository)!);
</script>

<style lang="scss" scoped></style>