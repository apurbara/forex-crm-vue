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
import { useDependencyInjection } from '../composables/dependency-injection';
import LayoutInterface from '@/resources/components/layout-interface';
import { CompanyUserRole } from '@/company-bc/role/company-user-repository';

const { companyUserRepository } = useDependencyInjection()
const guestLayout: LayoutInterface = {
  home: {
    title: "pintar-forex",
    to: "/home",
  },
  appBarMenuItems: [
    {
      title: "login",
      icon: "mdi-login",
      to: "/login",
    },
  ],
}
const layout = computed(() => companyUserRepository?.getUser<CompanyUserRole>()?.getLayout(companyUserRepository) ?? guestLayout);
</script>

<style lang="scss" scoped></style>