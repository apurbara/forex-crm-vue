<template>
  <div>
    <h1 class="page-title">Add Area Structure Branch</h1>
    <div class="form">
      <div class="mb-4">
        <p>Parent Information:</p>
        <p>name: {{ parent.label.name }}</p>
        <p>description: {{ parent.label.description }}</p>
      </div>
      <AreaStructureComponent :area-structure="areaStructure" />
      <div class="d-flex justify-end">
        <v-btn :disabled="!areaStructure.isValidProperties()" @click="submit">Submit</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AreaStructureComponent from '@/domain/model/AreaStructureComponent.vue';
import AreaStructure, { AreaStructureType } from '@/domain/model/area-structure';
import { CompanyUserRoleInterface } from '@/domain/user-role/role-interfaces';
import ItemCardComponent from '@/shared/components/item-card-component.vue';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted } from 'vue';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const areaStructure = reactive(new AreaStructure());

const { httpRequest, userRepository, cache } = useDependencyInjection()
const user = userRepository.getUser<CompanyUserRoleInterface>()
const router = useRouter()
const props = defineProps<{ areaStructureId: string }>()

const parent = reactive(new AreaStructure());
onMounted(async () => {
  const cacheData = cache?.pull<AreaStructureType>(`area-structure-${props.areaStructureId}`);
  if (cacheData) {
    parent.load(cacheData);
  } else {
    const response = await userRepository?.getUser<CompanyUserRoleInterface>()
      .executeGraphqlQueryInCompany<{ areaStructureDetail: AreaStructureType }>(httpRequest, {
        operation: 'areaStructureDetail',
        variables: { areaStructureId: { type: 'ID!', value: props.areaStructureId } },
        fields: ['id', 'disabled', 'createdTime', 'name', 'description'],
      })
    parent.load(response.areaStructureDetail)
  }
})

const submit = async () => {
  const response = await user?.executeGraphqlMutationInCompany<{ areaStructure: { addChild: AreaStructureType } }>(httpRequest, {
    operation: 'areaStructure',
    variables: { areaStructureId: { value: parent.id, required: true, type: "ID" } },
    fields: [{
      operation: 'addChild',
      variables: areaStructure.toGraphqlVariables(),
      fields: ["id", "disabled", "createdTime", "name", "description"]
    }]
  })
  const branchData = response.areaStructure.addChild;
  cache?.set(`area-structure-${branchData.id}`, branchData)
  router.push(`/area-structure/${branchData.id}`)
}

</script>

<style lang="scss" scoped></style>