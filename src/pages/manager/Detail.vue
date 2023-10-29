<template>
  <div>
    <h1 class="page-title">Manager Detail</h1>
    <section class="page-section">
      <h2 class="section-title">Personnel Info</h2>
      <p>name: {{ manager.personnel?.accountInfo.name }}</p>
      <p>email: {{ manager.personnel?.accountInfo.email }}</p>
      <p>created time: {{ manager.createdTime }}</p>
    </section>
  </div>
</template>

<script lang="ts" setup>
import PersonnelCreateComponent from '@/domain/model/PersonnelCreateComponent.vue';
import Manager, { ManagerType } from '@/domain/model/personnel/manager';
import { CompanyUserRoleInterface } from '@/domain/user-role/role-interfaces';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted } from 'vue';
import { reactive } from 'vue';

const { httpRequest, userRepository, cache } = useDependencyInjection();

const manager = reactive(new Manager())
const props = defineProps<{ managerId: string }>()

onMounted(async () => {
  const cacheData = cache?.pull<ManagerType>(`manager-${props.managerId}`);
  if (cacheData) {
    manager.load(cacheData);
  } else {
    const response = await userRepository?.getUser<CompanyUserRoleInterface>()
      .executeGraphqlQueryInCompany<{ managerDetail: ManagerType }>(httpRequest, {
        operation: 'managerDetail',
        variables: { managerId: { type: 'ID!', value: props.managerId } },
        fields: ['id', 'disabled', 'createdTime', { personnel: ["id", "name"] }],
      })
    manager.load(response.managerDetail)
  }
})
</script>

<style lang="scss" scoped></style>