<template>
  <div>
    <h1 class="page-title">Area Structure Detail</h1>
    <div class="form">
      <div class="d-flex justify-end" v-if="!areaStructure.parent">
        <v-btn prepend-icon="mdi-map-marker-plus-outline" variant="tonal"
          @click="toAddRootArea">Add Root Area</v-btn>
      </div>
      <AreaStructureComponent :area-structure="areaStructure"></AreaStructureComponent>
      <v-switch color="success" label="Active" v-model="areaStructure.disabled" :true-value="false" :false-value="true" />
      <p>created time: {{ areaStructure.createdTime }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AreaStructureComponent from '@/domain/model/AreaStructureComponent.vue';
import AreaStructure, { AreaStructureType } from '@/domain/model/area-structure';
import { CompanyUserRoleInterface } from '@/domain/user-role/role-interfaces';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted } from 'vue';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const { httpRequest, userRepository, cache } = useDependencyInjection();

const areaStructure = reactive(new AreaStructure())
const props = defineProps<{ areaStructureId: string }>()
const router = useRouter();
let cacheData: AreaStructureType;

onMounted(async () => {
  cacheData = cache?.pull<AreaStructureType>(`area-structure-${props.areaStructureId}`);
  if (cacheData) {
    areaStructure.load(cacheData);
  } else {
    const response = await userRepository?.getUser<CompanyUserRoleInterface>()
      .executeGraphqlQueryInCompany<{ areaStructureDetail: AreaStructureType }>(httpRequest, {
        operation: 'areaStructureDetail',
        variables: { areaStructureId: { type: 'ID!', value: props.areaStructureId } },
        fields: ['id', 'disabled', 'createdTime', 'name', 'description', { parent: ["id", "name"] }],
      })
    cacheData = response.areaStructureDetail
    areaStructure.load(cacheData)
  }
})

const toAddRootArea = () => {
  cache.set(`area-structure-${cacheData.id!}`, cacheData)
  router.push(`/area/add-root/${cacheData.id!}`)
}
</script>

<style lang="scss" scoped></style>