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
import UserRepository from '@/domain/user-repository';
import { UserRoleInterface } from '@/domain/user-role/role-interfaces';
import LayoutComponent from '@/resources/components/LayoutComponent.vue';
import { computed } from 'vue';
import { inject } from 'vue';

const userRepository = inject<UserRepository>('userRepository');
const layout = computed(() => userRepository?.getUser<UserRoleInterface>().getLayout(userRepository)!);
</script>

<style lang="scss" scoped></style>