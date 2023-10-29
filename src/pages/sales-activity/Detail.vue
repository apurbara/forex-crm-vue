<template>
  <div>
    <h1 class="page-title">Sales Activity Detail</h1>
    <div class="form">
      <sales-activity-component :sales-activity="salesActivity" />
      <div class="d-inline-flex justify-start align-center">
        <v-switch color="success" label="Active" v-model="salesActivity.disabled" :true-value="false"
          :false-value="true" class="mr-4" hide-details/>
        <v-chip v-if="salesActivity.initial" color="success">initial</v-chip>
      </div>
      <p>created time: {{ salesActivity.createdTime }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SalesActivityComponent from '@/domain/model/SalesActivityComponent .vue';
import SalesActivity, { SalesActivityType } from '@/domain/model/sales-activity';
import { CompanyUserRoleInterface } from '@/domain/user-role/role-interfaces';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted } from 'vue';
import { reactive } from 'vue';

const { httpRequest, userRepository, cache } = useDependencyInjection();

const salesActivity = reactive(new SalesActivity())
const props = defineProps<{ salesActivityId: string }>()

onMounted(async () => {
  const cacheData = cache?.pull<SalesActivityType>(`sales-activity-${props.salesActivityId}`);
  if (cacheData) {
    salesActivity.load(cacheData);
  } else {
    const response = await userRepository?.getUser<CompanyUserRoleInterface>()
      .executeGraphqlQueryInCompany<{ salesActivityDetail: SalesActivityType }>(httpRequest, {
        operation: 'salesActivityDetail',
        variables: { salesActivityId: { type: 'ID!', value: props.salesActivityId } },
        fields: ['id', 'disabled', 'createdTime', 'name', 'description', 'duration', 'initial'],
      })
    salesActivity.load(response.salesActivityDetail)
  }
})
</script>

<style lang="scss" scoped></style>