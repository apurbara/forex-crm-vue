<template>
  <section v-if="metricSummaries.length > 0" class="page-section" style="min-width: 48%;">
    <h2 class="section-title mb-4">Metric Summaries</h2>
    <v-row>
      <v-col class="border-sm ma-2 pa-2" v-for="(metricSummary, key) in metricSummaries" :key="key">
        <div v-if="metricSummary.dailyReminderTarget ?? 0 > 0" class="mb-4">
          <p>daily progress: {{ metricSummary.dailyAchievement }} / {{ metricSummary.dailyReminderTarget }}</p>
          <ProgressBar :value="(metricSummary.dailyAchievement ?? 0) / (metricSummary.dailyReminderTarget ?? 0)" />
        </div>
        <div style="max-height: 300px;">
          <h4 v-if="metricSummary.target">Target: {{ thousandSeparator(metricSummary.target) }}</h4>
          <Bar :id="key" :options="setChartOptions(metricSummary)" :data="setChartData(metricSummary)" />
        </div>
      </v-col>
    </v-row>
  </section>
</template>

<script setup lang="ts">
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, ref } from 'vue';
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, plugins } from 'chart.js'
import ProgressBar from 'primevue/progressbar';
import { useThousandSeparator } from '@/resources/composables/typography';
import Annotation from "chartjs-plugin-annotation";

const { salesRepository } = useDependencyInjection()
const thousandSeparator = (value: number) => useThousandSeparator(value);

type MetricSummary = {
  name: string;
  target?: number;
  dailyAchievement?: number;
  dailyReminderTarget?: number;
  result: { evaluationTime: string, achievement: number }[],
}
const metricSummaries = ref<MetricSummary[]>([])

onMounted(async () => {
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
  ChartJS.register(Annotation)
  metricSummaries.value = await salesRepository.getUser()
    .executeGetRequest('view-all-striking-metric-achievement')
})

const setChartData = (companyMetricSummary: MetricSummary) => {
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

const setChartOptions = (metricSummary: MetricSummary) => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      annotation: {
        annotations: {
          line1: {
            yMin: metricSummary.target,
            yMax: metricSummary.target,
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