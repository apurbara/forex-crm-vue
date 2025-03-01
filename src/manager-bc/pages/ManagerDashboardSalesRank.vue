<template>
  <Card v-if="salesRankSummaries.length > 0">
    <template #title>
      <h2>Sales Rank</h2>
    </template>
    <template #content>
      <div class="flex flex-wrap gap-4">
        <div
          v-for="(salesRankSummary, key) in salesRankSummaries"
          :key="key"
          class="flex-1 !bg-slate-100 rounded-lg p-4"
        >
          <div class="flex justify-center">
            <p class="text-stone-500 text-lg mb-2">{{ salesRankSummary.name }}</p>
          </div>
          <DataTable
            :value="salesRankSummary.result"
            size="small"
            fluid
            stripedRows
            :row-class="() => 'bg-transparent'"
            class="w-full !bg-transparent"
          >
            <Column field="name" header="Name" class="bg-transparent"></Column>
            <Column field="evaluationTime" header="Evaluation Time" class="bg-transparent"></Column>
            <Column
              class="bg-transparent"
              :field="(el) => parseInt(el.achievement).toLocaleString('id-ID')"
              header="Achievement"
            ></Column>
          </DataTable>
        </div>
      </div>
    </template>
    <!-- <v-row>
      <v-col
        class="border-sm ma-2 pa-2"
        v-for="(salesRankSummary, key) in salesRankSummaries"
        :key="key"
      >
        <h3 class="mb-2">{{ salesRankSummary.name }}</h3>
        <div v-if="!salesRankSummary.result.length">
          <p class="text-slate-400">No data available</p>
        </div>
        <v-table v-else density="compact" style="width: 100%" class="datatable">
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
    </v-row> -->
  </Card>
</template>

<script setup lang="ts">
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { onMounted, ref } from "vue";

const { managerRepository } = useDependencyInjection();

type SalesRankSummary = {
  name: string;
  result: { id: string; name: string; evaluationTime: string; achievement: number }[];
};
const salesRankSummaries = ref<SalesRankSummary[]>([]);

onMounted(async () => {
  salesRankSummaries.value = await managerRepository
    .getUser()
    .executeGetRequest("manager/view-all-sales-rank-summary");
});
</script>

<style scoped></style>
