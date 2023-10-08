<template>
  <div>
    <v-divider v-if="menuItem === 'divider'" />

    <v-list-group v-else-if="menuItem.children?.length" :value="false" :prepend-icon="menuItem.icon">
      <template v-slot:activator="{ props }">
        <v-list-item v-bind="props" :title="menuItem.title"></v-list-item>
      </template>
      <MenuItemComponent v-for="(child, key) in menuItem.children" :key="key" :menu-item="child" />
    </v-list-group>

    <v-list-item v-else :title="menuItem.title" :to="menuItem.to" :prepend-icon="menuItem.icon" :key="menuItem.title" />

  </div>
</template>

<script setup lang="ts">
import MenuItemInterface from './menu-item-interface';

const props = defineProps<{ menuItem: MenuItemInterface | "divider" }>()
</script>

<style></style>