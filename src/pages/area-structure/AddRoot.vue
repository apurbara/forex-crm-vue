<template>
  <div>
    <h1 class="page-title">Add Root Area Structure</h1>
    <div class="form">
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
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const areaStructure = reactive(new AreaStructure());

const {httpRequest, userRepository, cache} = useDependencyInjection()
const user = userRepository.getUser<CompanyUserRoleInterface>()
const router = useRouter()


const submit = async () => {
  const response = await user?.executeGraphqlMutationInCompany<{ addRootAreaStructure: AreaStructureType }>(httpRequest, {
    operation: 'addRootAreaStructure',
    variables: areaStructure.toGraphqlVariables(),
    fields: ['id', 'disabled', 'createdTime', 'name', 'description']
  })
  cache?.set(`area-structure-${response?.addRootAreaStructure.id}`, response?.addRootAreaStructure)
  router.push(`/area-structure/${response?.addRootAreaStructure.id}`)
}

</script>

<style lang="scss" scoped></style>