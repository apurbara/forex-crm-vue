<template>
  <section v-if="companyMetricSummaries.length > 0" class="page-section ma-2" style="min-width: 48%;">
    <h2 class="section-title mb-4">Manager Metric Summaries</h2>
    <v-row>
      <v-col class="border-sm ma-2 pa-2" v-for="(companyMetricSummary, key) in companyMetricSummaries" :key="key">
        <!-- <h4 v-if="companyMetricSummary.target">Target: {{ companyMetricSummary.target }}</h4> -->
        <Chart type="bar" :data="setChartData(companyMetricSummary)" :options="chartOptions" class="h-30rem" />
      </v-col>
    </v-row>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Chart from 'primevue/chart';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';


const { companyUserRepository } = useDependencyInjection()
const chartOptions = ref();

type CompanyMetricSummary = {
  name: string;
  target?: number;
  result: { evaluationTime: string, achievement: number }[],
}
const companyMetricSummaries = ref<CompanyMetricSummary[]>([])

onMounted(async () => {
  companyMetricSummaries.value = await companyUserRepository.getUser()
    .executeGetRequest('view-all-company-metric-summary')!
  chartOptions.value = setChartOptions()
})

const setChartData = (companyMetricSummary: CompanyMetricSummary) => {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    labels: companyMetricSummary.result.map(el => el.evaluationTime),
    datasets: [
      {
        label: companyMetricSummary.name,
        backgroundColor: documentStyle.getPropertyValue('--blue-500'),
        borderColor: documentStyle.getPropertyValue('--blue-500'),
        data: companyMetricSummary.result.map(el => el.achievement)
      },
    ]
  };
};
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        labels: {
          color: textColor
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
          font: {
            weight: 500
          }
        },
        grid: {
          display: false,
          drawBorder: false
        }
      },
      y: {
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder,
          drawBorder: false
        }
      }
    }
  };
}

</script>

<style scoped></style>