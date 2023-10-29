<template>
  <div>
    <h1 class="page-title">Add Root Area</h1>
    <div class="form">
      <div>
        <p>Area Structure Information</p>
        <p>name: {{ area.areaStructure?.label.name }}</p>
        <p>description: {{ area.areaStructure?.label.description }}</p>
      </div>
      <AreaComponent :area="area" />
      <div class="d-flex justify-end">
        <v-btn :disabled="!area.isValidProperties()" @click="submit">Submit</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AreaStructure, { AreaStructureType } from '@/domain/model/area-structure';
import AreaComponent from '@/domain/model/area-structure/AreaComponent.vue';
import Area, { AreaType } from '@/domain/model/area-structure/area';
import { CompanyUserRoleInterface } from '@/domain/user-role/role-interfaces';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted } from 'vue';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const area = reactive(new Area());

const { httpRequest, userRepository, cache } = useDependencyInjection()
const user = userRepository.getUser<CompanyUserRoleInterface>()
const router = useRouter()
const props = defineProps<{ areaStructureId: string }>()

onMounted(async () => {
  let areaStructureData = cache?.pull<AreaStructureType>(`area-structure-${props.areaStructureId}`);
  if (!areaStructureData) {
    const response = await userRepository?.getUser<CompanyUserRoleInterface>()
      .executeGraphqlQueryInCompany<{ areaStructureDetail: AreaStructureType }>(httpRequest, {
        operation: 'areaStructureDetail',
        variables: { areaStructureId: { type: 'ID!', value: props.areaStructureId } },
        fields: ['id', 'disabled', 'createdTime', 'name', 'description', { parent: ["id", "name"] }],
      })
    areaStructureData = response.areaStructureDetail
  }
  const areaStructure = new AreaStructure();
  areaStructure.load(areaStructureData);
  area.areaStructure = areaStructure;
})

const submit = async () => {
  const response = await user?.executeGraphqlMutationInCompany<{ areaStructure: { addRootArea: AreaType } }>(httpRequest, {
    operation: 'areaStructure',
    variables: { areaStructureId: { type: "ID", required: true, value: area.areaStructure?.id } },
    fields: [{
      operation: 'addRootArea',
      variables: area.toGraphqlVariables(),
      fields: ["id", "disabled", "createdTime", "name", "description", { areaStructure: ["id", "name", "description"] }]
    }]
  })
  const data = response.areaStructure.addRootArea;
  cache?.set(`area-${data.id}`, data)
  router.push(`/area/${data.id}`)
}

</script>

<style lang="scss" scoped></style>