<template>
  <div>
    <h1 class="page-title">Add Personnel</h1>
    <div class="form">
      <personnel-create-component :personnel="personnel" />
      <div class="d-flex justify-end">
        <v-btn :disabled="!personnel.isValidToCreate()" @click="submit">Submit</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CacheInterface from '@/domain/cache-interface';
import PersonnelCreateComponent from '@/domain/model/PersonnelCreateComponent.vue';
import Personnel, { PersonnelType } from '@/domain/model/personnel';
import UserRepository from '@/domain/user-repository';
import HttpRequestInterface from '@/domain/user-role/http-request-interface';
import { CompanyUserRoleInterface } from '@/domain/user-role/role-interfaces';
import { inject } from 'vue';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const personnel = reactive(new Personnel());

const httpRequest = inject<HttpRequestInterface>('httpRequest')!
const user = inject<UserRepository>('userRepository')?.getUser<CompanyUserRoleInterface>()
const cache = inject<CacheInterface>('cache')
const router = useRouter()


const submit = async () => {
  const response = await user?.executeGraphqlMutationInCompany<{ addPersonnel: PersonnelType }>(httpRequest, {
    operation: 'addPersonnel',
    variables: personnel.toGraphqlVariables(),
    fields: ['id', 'disabled', 'name', 'email']
  })
  cache?.set(`personnel-${response?.addPersonnel.id}`, response?.addPersonnel)
  router.push(`/personnel/${response?.addPersonnel.id}`)
}

</script>

<style lang="scss" scoped></style>