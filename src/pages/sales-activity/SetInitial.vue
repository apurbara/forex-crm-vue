<template>
  <div>
    <h1 class="page-title">Set Initial Sales Activity</h1>
    <div class="form">
      <sales-activity-component :sales-activity="salesActivity" />
      <div class="d-flex justify-end">
        <v-btn :disabled="!salesActivity.isValidProperties()" @click="submit">Submit</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SalesActivityComponent from '@/domain/model/SalesActivityComponent .vue';
import SalesActivity, { SalesActivityType } from '@/domain/model/sales-activity';
import { CompanyUserRoleInterface } from '@/domain/user-role/role-interfaces';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const salesActivity = reactive(new SalesActivity());

const { httpRequest, userRepository, cache } = useDependencyInjection()
const router = useRouter()


const submit = async () => {
  const response = await userRepository.getUser<CompanyUserRoleInterface>()
    .executeGraphqlMutationInCompany<{ setInitialSalesActivity: SalesActivityType }>(httpRequest, {
      operation: 'setInitialSalesActivity',
      variables: salesActivity.toGraphqlVariables(),
      fields: ['id', 'disabled', 'createdTime', 'name', 'description', 'duration', 'initial']
    })
  const data = response.setInitialSalesActivity
  cache?.set(`sales-activity-${data.id}`, data)
  router.push(`/sales-activity/${data.id}`)
}

</script>

<style lang="scss" scoped></style>