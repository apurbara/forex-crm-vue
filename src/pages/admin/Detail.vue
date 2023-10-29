<template>
  <div>
    <h1 class="page-title">Admin Detail</h1>
    <div class="form">
      <v-row>
        <v-col cols="12" md="6"><v-text-field label="Name" v-model="admin.accountInfo.name" /></v-col>
        <v-col cols="12" md="6"><v-text-field label="Email" v-model="admin.accountInfo.email" /></v-col>
      </v-row>
      <v-switch color="success" label="Super User" v-model="admin.aSuperUser" />
      <v-switch color="success" label="Active" v-model="admin.disabled" :true-value="false" :false-value="true" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Admin, { AdminType } from '@/domain/model/admin';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted } from 'vue';
import { reactive } from 'vue';

const { httpRequest, userRepository, cache } = useDependencyInjection();

const admin = reactive(new Admin())
const props = defineProps<{ adminId: string }>()

onMounted(async () => {
  const cacheData = cache?.pull<AdminType>(`admin-${props.adminId}`);
  if (cacheData) {
    admin.load(cacheData);
  } else {
    const response = await userRepository?.getInnovUser()
      .executeGraphqlQueryInInnov<{ adminDetail: AdminType }>(httpRequest, {
        operation: 'adminDetail',
        variables: { adminId: { type: 'ID!', value: props.adminId } },
        fields: ['id', 'name', 'email', 'aSuperUser', 'disabled'],
      })
    admin.load(response.adminDetail)
  }
})
</script>

<style lang="scss" scoped></style>