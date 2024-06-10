<template>
  <section v-if="metricSummaries.length > 0" class="page-section ma-2" style="min-width: 48%;">
    <h2 class="section-title mb-4">Metric Summaries</h2>
    <v-row>
      <v-col class="border-sm ma-2 pa-2" v-for="(metricSummary, key) in metricSummaries" :key="key">
        <h4>Target: {{ metricSummary.target }}</h4>
        <Chart type="bar" :data="setChartData(metricSummary)" :options="chartOptions" class="h-30rem" />
      </v-col>
    </v-row>
  </section>
</template>

<script setup lang="ts">
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, ref } from 'vue';
import Chart from 'primevue/chart';


const { salesRepository, restRequest } = useDependencyInjection()
const chartOptions = ref();

type MetricSummry = {
  name: string;
  target?: number;
  result: { evaluationTime: string, achievement: number }[],
}
const metricSummaries = ref<MetricSummry[]>([])

onMounted(async () => {
  metricSummaries.value = await salesRepository.getUser()
    .executeGetRequest(restRequest, 'view-all-common-sales-metric-summary')
  chartOptions.value = setChartOptions()
})

const setChartData = (companyMetricSummary: MetricSummry) => {
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