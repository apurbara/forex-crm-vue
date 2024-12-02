<template>
  <section v-if="companyMetricSummaries.length > 0" class="page-section ma-2" style="min-width: 48%;">
    <h2 class="section-title mb-4">Manager Metric Summaries</h2>
    <v-row>
      <v-col class="border-sm ma-2 pa-2" v-for="(companyMetricSummary, key) in companyMetricSummaries" :key="key">
        <div style="max-height: 300px;">
          <h4 v-if="companyMetricSummary.target">Target: {{ thousandSeparator(companyMetricSummary.target) }}</h4>
          <Bar :id="key" :options="setChartOptions(companyMetricSummary)" :data="setChartData(companyMetricSummary)" />
        </div>
      </v-col>
    </v-row>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, plugins } from 'chart.js'
import Annotation from "chartjs-plugin-annotation";
import { useThousandSeparator } from '@/resources/composables/typography';

const { managerRepository } = useDependencyInjection()
const thousandSeparator = (value: number) => useThousandSeparator(value);

type CompanyMetricSummary = {
  name: string;
  target?: number;
  result: { evaluationTime: string, achievement: number }[],
}
const companyMetricSummaries = ref<CompanyMetricSummary[]>([])

onMounted(async () => {
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
  ChartJS.register(Annotation)
  companyMetricSummaries.value = await managerRepository.getUser()
    .executeGetRequest('manager/view-all-company-metric-summary')
})

const setChartData = (companyMetricSummary: CompanyMetricSummary) => {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    labels: companyMetricSummary.result.map(el => el.evaluationTime),
    datasets: [
      {
        label: companyMetricSummary.name,
        backgroundColor: documentStyle.getPropertyValue('--blue-500'),
        data: companyMetricSummary.result.map(el => el.achievement)
      },
    ]
  };
};

const setChartOptions = (companyMetricSummary: CompanyMetricSummary) => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      annotation: {
        annotations: {
          line1: {
            yMin: companyMetricSummary.target,
            yMax: companyMetricSummary.target,
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 2,
          }
        }
      }
    }
  };
}

</script>

<style scoped></style>