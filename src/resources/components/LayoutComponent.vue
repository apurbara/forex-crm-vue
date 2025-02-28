<template>
  <div class="layout">
    <v-app-bar app absolute :clipped-left="true" elevation="1" color="transparent" v-bind="$attrs">
      <v-app-bar-nav-icon v-if="layout.navBarMenuItems?.length && !lgAndUp" @click="toggleNavbar" />
      <HomeComponent :home="layout.home"></HomeComponent>
      <v-spacer />
      <AppBarMenuItemComponent v-for="(appBarMenuItem, key) in layout.appBarMenuItems" :key="key"
        :menu-item="appBarMenuItem" />
      <v-btn v-if="showLogout" plain @click="logout">
        <v-icon icon="mdi-logout" />
      </v-btn>
    </v-app-bar>
    <!--  -->
    <v-navigation-drawer v-if="showNavBar" permanent app :clipped="true" absolute elevation="1">
      <v-list nav>
        <MenuItemComponent v-for="(navBarMenuItem, index) in layout.navBarMenuItems" :key="index"
          :menu-item="navBarMenuItem" />
      </v-list>
    </v-navigation-drawer>
    <!--  -->
    <v-main>
      <slot></slot>
      <!-- <v-container fluid>
        <router-view />
      </v-container> -->
    </v-main>
    <!--  -->
    <v-footer id="footer" color="transparent" absolute app inset>
      Footer elements
    </v-footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LayoutInterface from './layout-interface';
import AppBarMenuItemComponent from './layout/AppBarMenuItemComponent.vue';
import HomeComponent from './layout/HomeComponent.vue';
import { computed } from 'vue';
import MenuItemComponent from './layout/MenuItemComponent.vue';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';

const props = withDefaults(defineProps<{ layout: LayoutInterface, showLogout?: boolean }>(), { showLogout: true });
const { smAndDown, lgAndUp } = useDisplay()
const navBarShowStatus = ref(!smAndDown.value);
const { companyUserRepository, adminRepository, managerRepository, salesRepository } = useDependencyInjection();

const showNavBar = computed((): boolean => !!props.layout.navBarMenuItems?.length && navBarShowStatus.value)

const toggleNavbar = () => navBarShowStatus.value = !navBarShowStatus.value;

const logout = () => {
  adminRepository.logUserOut();
  managerRepository.logUserOut();
  salesRepository.logUserOut();
  companyUserRepository.logUserOut();
}
</script>

<style></style>
