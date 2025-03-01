<template>
  <Card v-if="companyMetricSummaries.length > 0">
    <template #title>
      <p>Team Target</p>
    </template>
    <template #content>
      <div class="flex flex-wrap gap-4">
        <div
          v-for="(companyMetricSummary, key) in companyMetricSummaries"
          class="flex-1 !bg-slate-100 rounded-lg p-4"
          :key="key"
        >
          <div class="flex justify-center">
            <p class="text-stone-500 text-lg">
              Target: {{ companyMetricSummary.target?.toLocaleString("id-ID") }}
            </p>
          </div>
          <Chart
            type="bar"
            :data="setChartData(companyMetricSummary)"
            :options="chartOptions"
            class="h-30rem"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import Chart from "primevue/chart";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";

const { managerRepository } = useDependencyInjection();
const chartOptions = ref();

type CompanyMetricSummary = {
  name: string;
  target?: number;
  result: { evaluationTime: string; achievement: number }[];
};
const companyMetricSummaries = ref<CompanyMetricSummary[]>([]);

onMounted(async () => {
  companyMetricSummaries.value = await managerRepository
    .getUser()
    .executeGetRequest("manager/view-all-company-metric-summary");
  chartOptions.value = setChartOptions();
});

const setChartData = (companyMetricSummary: CompanyMetricSummary) => {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    labels: companyMetricSummary.result.map((el) => el.evaluationTime),
    datasets: [
      {
        label: companyMetricSummary.name,
        backgroundColor: documentStyle.getPropertyValue("--blue-500"),
        borderColor: documentStyle.getPropertyValue("--blue-500"),
        data: companyMetricSummary.result.map((el) => el.achievement),
      },
    ],
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
