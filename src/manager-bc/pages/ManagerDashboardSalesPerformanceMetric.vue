<template>
  <Card v-if="salesPerformanceMetricSummaries.length > 0">
    <template #title>
      <h2>Sales Performance Metric Summaries</h2>
    </template>
    <template #content>
      <div class="flex flex-wrap gap-4">
        <div
          v-for="(salesPerformanceMetricSummary, key) in salesPerformanceMetricSummaries"
          class="flex-1 !bg-slate-100 rounded-lg p-4"
          :key="key"
        >
          <div class="flex justify-center">
            <p class="text-stone-500 text-lg">{{ salesPerformanceMetricSummary.name }}</p>
          </div>
          <Chart
            type="bar"
            :data="setChartData(salesPerformanceMetricSummary)"
            :options="chartOptions"
            class="h-30rem"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { onMounted, ref } from "vue";
import Chart from "primevue/chart";

const { managerRepository } = useDependencyInjection();
const chartOptions = ref();

type SalesPerformanceMetricSummary = {
  name: string;
  result: { evaluationTime: string; [key: string]: any }[];
};
const salesPerformanceMetricSummaries = ref<SalesPerformanceMetricSummary[]>([]);

onMounted(async () => {
  salesPerformanceMetricSummaries.value = await managerRepository
    .getUser()
    .executeGetRequest("manager/view-all-sales-performance-metric-summary");
  chartOptions.value = setChartOptions();
});

const setChartData = (salesPerformanceMetricSummary: SalesPerformanceMetricSummary) => {
  // const documentStyle = getComputedStyle(document.documentElement);
  const evaluationAliases = Object.keys(salesPerformanceMetricSummary.result[0] ?? {});

  const datasets: any[] = [];
  const colorSchema = ["#e65c08", "#e6c808", "#6ae608", "#08e6e6", "#0874e6", "#7408e6"];
  let selectedColor = 0;
  evaluationAliases.forEach((evaluationAlias) => {
    if (evaluationAlias !== "evaluationTime") {
      datasets.push({
        label: evaluationAlias,
        backgroundColor: colorSchema[selectedColor],
        borderColor: colorSchema[selectedColor],
        data: salesPerformanceMetricSummary.result.map((el) => el[evaluationAlias]),
      });
      selectedColor++;
    }
  });
  return {
    labels: salesPerformanceMetricSummary.result.map((el) => el.evaluationTime),
    datasets: datasets,
    // datasets: [
    //   {
    //     label: salesPerformanceMetricSummary.name,
    //     backgroundColor: documentStyle.getPropertyValue('--blue-500'),
    //     borderColor: documentStyle.getPropertyValue('--blue-500'),
    //     data: salesPerformanceMetricSummary.result.map(el => el.achievement)
    //   },
    // ]
  };
};
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--text-color");
  const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");
  const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
          font: {
            weight: 500,
          },
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
          drawBorder: false,
        },
      },
    },
  };
};
</script>

<style scoped></style>
