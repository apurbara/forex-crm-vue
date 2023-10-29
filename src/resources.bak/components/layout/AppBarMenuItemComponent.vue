<template>
  <div>
    <v-btn v-if="menuItem.callableAction" plain @click="executeCallableAction">
      <v-icon v-if="menuItem.icon" :icon="menuItem.icon" />
      {{ menuItem.title }}
    </v-btn>
    <v-btn v-else-if="menuItem.to" :to="menuItem.to" plain>
      <v-icon v-if="menuItem.icon" :icon="menuItem.icon" />
      {{ menuItem.title }}
    </v-btn>
    <v-btn v-else :id="`appbar__menu-${menuItem.title}`" plain>
      <v-icon v-if="menuItem.icon" :icon="menuItem.icon" />
      {{ menuItem.title }}
    </v-btn>

    <v-menu v-if="menuItem.children != null" :activator="`#appbar__menu-${menuItem.title}`">
      <v-list>
        <MenuItemComponent v-for="(child, key) in menuItem.children" :key="key" :menu-item="child" />
      </v-list>
    </v-menu>

  </div>
</template>

<script setup lang="ts">

import MenuItemComponent from './MenuItemComponent.vue';
import MenuItemInterface from './menu-item-interface';

const props = defineProps<{ menuItem: MenuItemInterface }>();

const executeCallableAction = () => {
  if(props.menuItem.callableAction){
    props.menuItem.callableAction();
  }
};

</script>

<style></style>
./menu-item