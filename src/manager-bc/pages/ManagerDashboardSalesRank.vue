<template>
  <section v-if="salesRankSummaries.length > 0" class="page-section ma-2" style="min-width: 48%;">
    <h2 class="section-title mb-4">Sales Rank</h2>
    <v-row>
      <v-col class="border-sm ma-2 pa-2" v-for="(salesRankSummary, key) in salesRankSummaries" :key="key">
        <h3 class="mb-2">{{ salesRankSummary.name }}</h3>
        <v-table density="compact" style="width: 100%;" class="datatable">
          <thead>
            <tr>
              <th>name</th>
              <th>evaluation Time</th>
              <th>achievement</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(sales, index) in salesRankSummary.result" :key="index">
              <td>{{ sales.name }}</td>
              <td>{{ sales.evaluationTime }}</td>
              <td>{{ sales.achievement }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </section>
</template>

<script setup lang="ts">
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, ref } from 'vue';


const { companyUserRepository, restRequest } = useDependencyInjection()

type SalesRankSummary = {
  name: string;
  result: { id: string, name: string, evaluationTime: string, achievement: number }[],
}
const salesRankSummaries = ref<SalesRankSummary[]>([])

onMounted(async () => {
  salesRankSummaries.value = await companyUserRepository.getUser()
    .executeGetRequest(restRequest, 'view-all-sales-rank-summary')
})

</script>

<style scoped></style>