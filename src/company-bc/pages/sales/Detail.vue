<template>
  <div>
    <h1 class="page-title">Sales Detail</h1>
    <div class="d-flex justify-end">
    </div>
    <div class="form">
      <SalesComponent :sales="sales" :readonly="true" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import SalesComponent from '@/company-bc/domain/model/SalesComponent.vue';
import Sales, { SalesType } from '@/company-bc/domain/model/sales';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, reactive } from 'vue';

const { httpRequest, companyUserRepository, cache } = useDependencyInjection();

const sales = reactive(new Sales())
const props = defineProps<{ salesId: string }>()
let cacheData: SalesType;

onMounted(async () => {
  cacheData = cache?.pull<SalesType>(`sales-${props.salesId}`);
  if (cacheData) {
    sales.load(cacheData);
  } else {
    const response = await companyUserRepository.getUser()
      .executeGraphqlQueryInCompany<{ viewSalesDetail: SalesType }>(httpRequest, {
        operation: 'viewSalesDetail',
        variables: { id: { type: 'ID!', value: props.salesId } },
        fields: [
          'id', 'cancelled', 'createdTime', 'cancelTime', 'name', 'email', 'type'
        ],
      })
    cacheData = response.viewSalesDetail
    sales.load(cacheData)
  }
})

</script>

<style lang="scss" scoped></style>