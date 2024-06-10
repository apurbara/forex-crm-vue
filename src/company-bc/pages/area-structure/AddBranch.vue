<template>
  <div>
    <h1 class="page-title">Add Area Structure Branch</h1>
    <div class="form">
      <div class="mb-4">
        <p>Parent Information:</p>
        <p>name: {{ areaStructure.parent?.label.name }}</p>
        <p>description: {{ areaStructure.parent?.label.description }}</p>
      </div>
      <AreaStructureComponent :area-structure="areaStructure" />
      <div class="d-flex justify-end">
        <v-btn :disabled="!areaStructure.isValidProperties()" @click="submit">Submit</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AreaStructureComponent from '@/company-bc/domain/model/AreaStructureComponent.vue';
import AreaStructure, { AreaStructureType } from '@/company-bc/domain/model/area-structure';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted } from 'vue';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const areaStructure = reactive(new AreaStructure());

const { httpRequest, companyUserRepository, cache } = useDependencyInjection()
const router = useRouter()
const props = defineProps<{ areaStructureId: string }>()

const parent = reactive(new AreaStructure());
onMounted(async () => {
  const cacheData = cache?.pull<AreaStructureType>(`area-structure-${props.areaStructureId}`);
  if (cacheData) {
    parent.load(cacheData);
  } else {
    const response = await companyUserRepository.getUser()
      .executeGraphqlQueryInCompany<{ areaStructureDetail: AreaStructureType }>(httpRequest, {
        operation: 'areaStructureDetail',
        variables: { id: { type: 'ID!', value: props.areaStructureId } },
        fields: ['id', 'disabled', 'createdTime', 'name', 'description'],
      })
    areaStructure.parent = new AreaStructure(response.areaStructureDetail);
  }
})

const submit = async () => {
  const response = await companyUserRepository.getUser()
    .executeGraphqlMutationInCompany<{ addChildAreaStructure: AreaStructureType }>(httpRequest, {
      operation: 'addChildAreaStructure',
      variables: areaStructure.toGraphqlVariables(),
      fields: ["id", "disabled", "createdTime", "name", "description"]
    })
  const branchData = response.addChildAreaStructure;
  cache?.set(`area-structure-${branchData.id}`, branchData)
  router.push(`/area-structure/${branchData.id}`)
}

</script>

<style lang="scss" scoped></style>