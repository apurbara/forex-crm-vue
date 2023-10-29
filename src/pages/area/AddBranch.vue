<template>
  <div>
    <h1 class="page-title">Add Area Structure Branch</h1>
    <div class="form">
      <div class="mb-4">
        <p>Parent Information:</p>
        <p>name: {{ area.parent?.label.name }}</p>
        <p>description: {{ area.parent?.label.description }}</p>
      </div>
      {{ area }}
      <v-select :items="branchAreaStructureList" item-title="name" menu-icon="mdi-chevron-down" return-object
        @update:model-value="selectAreaStructure"></v-select>
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
import { ref } from 'vue';
import { onMounted } from 'vue';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const area = reactive(new Area());

const { httpRequest, userRepository, cache } = useDependencyInjection()
const user = userRepository.getUser<CompanyUserRoleInterface>()
const router = useRouter()
const props = defineProps<{ areaId: string }>()
const branchAreaStructureList = ref<AreaStructureType[]>([]);

onMounted(async () => {
  let cacheData = cache?.pull<AreaType>(`area-${props.areaId}`);
  if (!cacheData) {
    const response = await userRepository?.getUser<CompanyUserRoleInterface>()
      .executeGraphqlQueryInCompany<{ areaDetail: AreaType }>(httpRequest, {
        operation: 'areaDetail',
        variables: { areaId: { type: 'ID!', value: props.areaId } },
        fields: ['id', 'disabled', 'createdTime', 'name', 'description', { areaStructure: ["id", "name"] }],
      })
    cacheData = response.areaDetail
  }
  area.parent = new Area()
  area.areaStructure = new AreaStructure()
  area.parent.load(cacheData)

  const brachAreaStructureListResponse = await userRepository.getUser<CompanyUserRoleInterface>()
    .executeGraphqlQueryInCompany<{ areaStructureList: { list: AreaStructureType[] } }>(httpRequest, {
      operation: "areaStructureList",
      variables: {
        filters: {
          type: "[FilterInput]", value: [
            { column: "AreaStructure_idOfParent", value: area.parent.areaStructure?.id, comparisonType: "EQ" }
          ]
        }
      },
      fields: [{ list: ["id", "name", "description"] }]
    })
  branchAreaStructureList.value = brachAreaStructureListResponse.areaStructureList.list
})

const submit = async () => {
  const response = await user?.executeGraphqlMutationInCompany<{ area: { addChild: AreaType } }>(httpRequest, {
    operation: 'area',
    variables: { areaId: { value: area.parent?.id, required: true, type: "ID" } },
    fields: [{
      operation: 'addChild',
      variables: {
        areaStructureId: { type: "ID", required: true, value: area.areaStructure?.id },
        ...area.toGraphqlVariables()
      },
      fields: [
        "id", "disabled", "createdTime", "name", "description",
        { parent: ["id", "name", "description"] },
        { areaStructure: ["id", "name", "description"] },
      ]
    }]
  })
  const branchData = response.area.addChild;
  cache?.set(`area-${branchData.id}`, branchData)
  router.push(`/area/${branchData.id}`)
}

const selectAreaStructure = (data: any) => area.areaStructure?.load(data)

</script>

<style lang="scss" scoped></style>