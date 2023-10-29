<template>
  <div>
    <h1 class="page-title">Add Admin</h1>
    <div class="form">
      <admin-create-component :admin="admin" />
      <div class="d-flex justify-end">
        <v-btn :disabled="!admin.isValidToCreate()" @click="submit">Submit</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CacheInterface from '@/domain/cache-interface';
import AdminCreateComponent from '@/domain/model/AdminCreateComponent.vue';
import Admin, { AdminType } from '@/domain/model/admin';
import UserRepository from '@/domain/user-repository';
import HttpRequestInterface from '@/domain/user-role/http-request-interface';
import { inject } from 'vue';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const admin = reactive(new Admin());

const httpRequest = inject<HttpRequestInterface>('httpRequest')!
const user = inject<UserRepository>('userRepository')?.getInnovUser()
const cache = inject<CacheInterface>('cache')
const router = useRouter()


const submit = async () => {
  const response = await user?.executeGraphqlMutationInInnov<{ addAdmin: AdminType }>(httpRequest, {
    operation: 'addAdmin',
    variables: admin.toGraphqlVariables(),
    fields: ['id', 'aSuperUser', 'disabled', 'name', 'email']
  })
  cache?.set(`admin-${response?.addAdmin.id}`, response?.addAdmin)
  router.push(`/admin/${response?.addAdmin.id}`)
}

</script>

<style lang="scss" scoped></style>