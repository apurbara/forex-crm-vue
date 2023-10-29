<template>
  <div>
    <h1 class="page-title">Area Detail</h1>
    <div class="form">
      <div class="d-flex justify-end">
        <v-btn prepend-icon="mdi-map-marker-plus-outline" variant="tonal"
          :to="`/area/${area.id}/add-branch`">Add Child Area</v-btn>
      </div>
      <AreaComponent :area="area"></AreaComponent>
      <v-switch color="success" label="Active" v-model="area.disabled" :true-value="false" :false-value="true" />
      <p>created time: {{ area.createdTime }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AreaComponent from '@/domain/model/area-structure/AreaComponent.vue';
import Area, { AreaType } from '@/domain/model/area-structure/area';
import { CompanyUserRoleInterface } from '@/domain/user-role/role-interfaces';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted } from 'vue';
import { reactive } from 'vue';

const { httpRequest, userRepository, cache } = useDependencyInjection();

const area = reactive(new Area())
const props = defineProps<{ areaId: string }>()

onMounted(async () => {
  const cacheData = cache?.pull<AreaType>(`area-${props.areaId}`);
  if (cacheData) {
    area.load(cacheData);
  } else {
    const response = await userRepository?.getUser<CompanyUserRoleInterface>()
      .executeGraphqlQueryInCompany<{ areaDetail: AreaType }>(httpRequest, {
        operation: 'areaDetail',
        variables: { areaId: { type: 'ID', value: props.areaId, required: true } },
        fields: [
          'id', 'disabled', 'createdTime', 'name', 'description',
          { areaStructure: ["id", "name", "description"] },
          { parent: ["id", "name", "description"] },
        ],
      })
    area.load(response.areaDetail)
  }
})
</script>

<style lang="scss" scoped></style>