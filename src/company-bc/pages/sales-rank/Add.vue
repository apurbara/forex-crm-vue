<template>
  <div>
    <h1 class="page-title">Add Sales Rank</h1>
    <div class="form">
      <SalesRankComponent :sales-rank="salesRank" />
      <div class="d-flex justify-end">
        <v-btn :disabled="!salesRank.isValidProperties()" @click="submit">Submit</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SalesRankComponent from '@/company-bc/domain/model/SalesRankComponent.vue';
import SalesRank, { SalesRankType } from '@/company-bc/domain/model/sales-rank';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const salesRank = reactive(new SalesRank());

const { companyUserRepository, cache } = useDependencyInjection()
const router = useRouter()


const submit = async () => {
  const response = await companyUserRepository.getUser()!
    .executeGraphqlMutationInCompany<{ createSalesRank: SalesRankType }>({
      operation: 'createSalesRank',
      variables: salesRank.toGraphqlVariables(),
      fields: [
        'id', 'disabled', 'lastModifiedTime', 'name', 'salesMetricType', 'salesRole', 'evaluationType', 'recurrenceType',
        'queryOrder', 'displaySalesNumber'
      ]
    })
  cache?.set(`sales-rank-${response?.createSalesRank.id}`, response?.createSalesRank)
  router.push(`/sales-rank/${response?.createSalesRank.id}`)
}

</script>

<style lang="scss" scoped></style>