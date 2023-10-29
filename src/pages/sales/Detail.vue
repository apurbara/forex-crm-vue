<template>
  <div>
    <h1 class="page-title">Sales Detail</h1>
    <section class="page-section">
      <h2 class="section-title">Personnel Info</h2>
      <p>name: {{ sales.personnel?.accountInfo.name }}</p>
      <p>email: {{ sales.personnel?.accountInfo.email }}</p>
      <p>created time: {{ sales.createdTime }}</p>
    </section>
    <section class="page-section">
      <h2 class="section-title">Manager Info</h2>
      <p>name: {{ sales.manager?.personnel?.accountInfo.name }}</p>
      <p>email: {{ sales.manager?.personnel?.accountInfo.email }}</p>
    </section>
  </div>
</template>

<script lang="ts" setup>
import Sales, { SalesType } from '@/domain/model/personnel/manager/sales';
import { CompanyUserRoleInterface } from '@/domain/user-role/role-interfaces';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted } from 'vue';
import { reactive } from 'vue';

const { httpRequest, userRepository, cache } = useDependencyInjection();

const sales = reactive(new Sales())
const props = defineProps<{ salesId: string }>()

onMounted(async () => {
  const cacheData = cache?.pull<SalesType>(`sales-${props.salesId}`);
  if (cacheData) {
    sales.load(cacheData);
  } else {
    const response = await userRepository?.getUser<CompanyUserRoleInterface>()
      .executeGraphqlQueryInCompany<{ salesDetail: SalesType }>(httpRequest, {
        operation: 'salesDetail',
        variables: { salesId: { type: 'ID!', value: props.salesId } },
        fields: [
          'id', 'disabled', 'createdTime',
          { personnel: ["id", "name", "email"] },
          { manager: ["id", { personnel: ["id", "name", "email"] }] }
        ],
      })
    sales.load(response.salesDetail)
  }
})
</script>

<style lang="scss" scoped></style>