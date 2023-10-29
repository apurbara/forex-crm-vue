<template>
  <div>
    <v-menu :close-on-content-click="false" v-model="showMenu" location="end">
      <template v-slot:activator="{ props }">
        <div v-bind="props" @click="prepareList()" class="d-flex justify-space-between align-center">
          <div class="filter-title">{{ enumFilter.label }}</div>
          <v-icon icon="mdi-chevron-right" end></v-icon>
        </div>
      </template>
      <v-card class="ml-4">
        <v-card-title>
          <v-text-field v-if="enumFilter.placeholder" :placeholder="enumFilter.placeholder" variant="plain" hide-details
            v-model="search" append-inner-icon="mdi-magnify">
          </v-text-field>
        </v-card-title>
        <v-virtual-scroll :max-height="200" :width="300" :items="filterValues">
          <template v-slot:default="{ item }">
            <v-list-item class="my-0 py-0">
              <template v-slot:prepend>
                <v-checkbox-btn color="primary" icon="mdi-checkbox-blank-outline" :value="item"
                  :label="item[enumFilter.itemTitle].toString()" v-model="selectedItems"></v-checkbox-btn>
              </template>
            </v-list-item>
            <v-divider />
          </template>
        </v-virtual-scroll>
        <v-card-actions class="d-flex justify-end px-4 py-2">
          <v-btn variant="tonal" density="comfortable" color="error" @click="cancelSelection">Cancel</v-btn>
          <v-btn variant="tonal" density="comfortable" color="success" @click="saveSelection">Apply</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import EnumFilter from './enum-filter';
import { onMounted } from 'vue';

const props = defineProps<{ enumFilter: EnumFilter }>()
const emit = defineEmits(['filterUpdated'])
const search = ref('')
const selectedItems = ref<Array<{ [key: string]: string | number | boolean }>>([])
const showMenu = ref(false)

const filterValues = computed(() => {
  const values = props.enumFilter.items;
  if (search.value) {
    return values.filter((value) => value[props.enumFilter.itemTitle].toString().toLowerCase().includes(search.value.toLocaleLowerCase()))
  } else {
    return values
  }
})

onMounted(() => {
  search.value = ''
  selectedItems.value.length = 0
  selectedItems.value.push(...props.enumFilter.selectedItems)
})

const saveSelection = () => {
  props.enumFilter.selectedItems.length = 0;
  props.enumFilter.selectedItems.push(...selectedItems.value);
  showMenu.value = false;
  emit('filterUpdated')
}
const cancelSelection = () => {
  selectedItems.value.length = 0;
  selectedItems.value.push(...props.enumFilter.selectedItems);
  showMenu.value = false;
}
const prepareList = async () => {
  await props.enumFilter.initItems();
}
</script>

<style lang="scss" scoped></style>
