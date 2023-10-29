<template>
  <div class="ma-0 pa-0">
    <v-menu :close-on-content-click="false" v-model="showMenu" location="end">
      <template v-slot:activator="{ props }">
        <div v-bind="props" @click="prepareList()" class="d-flex justify-space-between">
          <div>{{ enumFilter.label }}</div>
          <div><img src="@/assets/icons/arrow-pagination-active.svg" alt="no data" /></div>
        </div>
      </template>
      <div>
        <v-card class="ml-4">
          <v-card-title>
            <v-text-field :placeholder="enumFilter.placeholder" variant="plain" hide-details v-model="search">
              <template v-slot:append-inner>
                <div class="btn-append-primary">
                  <img src="@/assets/icons/ic-search.svg" style="position: relative; top: 12px; left: 12px"
                    alt="Search" />
                </div>
              </template>
            </v-text-field>
          </v-card-title>
          <v-virtual-scroll :height="200" :width="300" :items="filterValues">
            <template v-slot:default="{ item }">
              <v-list-item class="my-0 py-0" :title="item[enumFilter.itemTitle]">
                <template v-slot:prepend>
                  <v-checkbox-btn color="primary" icon="mdi-checkbox-blank-outline" v-model="selectedItems"
                    :label="item[enumFilter.itemTitle]" :value="item[enumFilter.itemValue]"></v-checkbox-btn>
                </template>
              </v-list-item>
              <v-divider />
            </template>
          </v-virtual-scroll>
          <v-card-actions class="mt-3">
            <v-col cols="12" class="d-flex justify-end pa-3">
              <v-btn height="48" color="error" width="100" class="mx-3 rounded-lg" elevation="0" variant="text"
                @click="cancelSelection">Batal</v-btn>
              <v-btn type="submit" class="primary" @click="saveSelection">Terapkan</v-btn>
            </v-col>
          </v-card-actions>
        </v-card>
      </div>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import EnumFilter from './enum-filter';
import { onMounted } from 'vue';

const props = defineProps<{ enumFilter: EnumFilter }>()
const emit = defineEmits(['filterUpdated'])
const search = ref('')
const selectedItems: Array<string> = reactive([])
const showMenu = ref(false)

const filterValues = computed(() => {
  const values = props.enumFilter.items;
  if (search.value) {
    return values.filter((value) => value[props.enumFilter.itemTitle].toLowerCase().includes(search.value.toLocaleLowerCase()))
  } else {
    return values
  }
})

onMounted(() => {
  search.value = ''
  selectedItems.length = 0
  selectedItems.push(...props.enumFilter.selectedItems)
})

const saveSelection = () => {
  props.enumFilter.selectedItems.length = 0;
  props.enumFilter.selectedItems.push(...selectedItems);
  showMenu.value = false;
  emit('filterUpdated')
}
const cancelSelection = () => {
  selectedItems.length = 0;
  selectedItems.push(...props.enumFilter.selectedItems);
  showMenu.value = false;
}
const prepareList = async () => {
  await props.enumFilter.prepareItems();
}
</script>

<style lang="scss" scoped></style>
