<template>
  <div>
    <h1 class="page-title">Area Structure Detail</h1>
    <div class="d-flex justify-end">
    </div>
    <div class="form">
      <div class="d-flex justify-end">
        <v-btn v-if="!areaStructure.parent" prepend-icon="mdi-map-marker-plus-outline" variant="tonal"
          @click="toAddRootArea">Register Area</v-btn>
        <v-btn class="ml-2" v-if="!editing" variant="tonal" @click="editing = !editing">Edit</v-btn>
        <v-btn class="ml-2" v-else variant="tonal" @click="cancelEdit">Cancel</v-btn>
      </div>
      <AreaStructureComponent :area-structure="areaStructure" :readonly="!editing"></AreaStructureComponent>
      <v-switch color="success" label="Active" v-model="areaStructure.disabled" :true-value="false"
        :false-value="true" />
      <p>created time: {{ new Date(areaStructure.createdTime!).toLocaleDateString() }}</p>
      <div class="d-flex justify-end" v-if="editing">
        <v-btn :disabled="!areaStructure.isValidProperties()" @click="update">Update</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AreaStructureComponent from '@/company-bc/domain/model/AreaStructureComponent.vue';
import AreaStructure, { AreaStructureType } from '@/company-bc/domain/model/area-structure';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const { httpRequest, companyUserRepository, cache } = useDependencyInjection();

const areaStructure = reactive(new AreaStructure())
const props = defineProps<{ areaStructureId: string }>()
let editing = ref(false)
const router = useRouter()
let cacheData: AreaStructureType;

onMounted(async () => {
  cacheData = cache?.pull<AreaStructureType>(`area-structure-${props.areaStructureId}`);
  if (cacheData) {
    areaStructure.load(cacheData);
  } else {
    const response = await companyUserRepository.getUser()
      .executeGraphqlQueryInCompany<{ areaStructureDetail: AreaStructureType }>(httpRequest, {
        operation: 'areaStructureDetail',
        variables: { id: { type: 'ID!', value: props.areaStructureId } },
        fields: ['id', 'disabled', 'createdTime', 'name', 'description', { parent: ["id", "name"] }],
      })
    cacheData = response.areaStructureDetail
    areaStructure.load(cacheData)
  }
})

const update = async () => {
  const response = await companyUserRepository.getUser()
    .executeGraphqlMutationInCompany<{ updateAreaStructure: AreaStructureType }>(httpRequest, {
      operation: "updateAreaStructure",
      variables: areaStructure.toGraphqlVariables(),
      fields: ['name', 'description'],
    })
  areaStructure.load(response.updateAreaStructure)
  cacheData = { ...cacheData, ...response.updateAreaStructure }
  editing.value = false
}

const cancelEdit = () => {
  areaStructure.load(cacheData)
  editing.value = false;
}

const toAddRootArea = () => {
  cache.set(`area-structure-${cacheData.id!}`, cacheData)
  router.push(`/area/add-root/${cacheData.id!}`)
}
</script>

<style lang="scss" scoped></style>