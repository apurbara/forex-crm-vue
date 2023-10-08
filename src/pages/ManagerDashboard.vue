<template>
  <div class="pa-4">

    <section>
      <h2>Product Highlight</h2>
      <div class="d-flex justify-space-around">
        <section>
          <h3>Product Summary</h3>
          <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full md:w-30rem"
            @select="productSelected" />
        </section>
        <section v-if="articleChartData">
          <h3>Article Summary</h3>
          <Chart type="doughnut" :data="articleChartData" :options="chartOptions" class="w-full md:w-30rem" />
        </section>
      </div>
    </section>

    <section class="my-8">
      <h2>Top Sales</h2>
      <v-slide-group show-arrows>
        <v-slide-group-item v-for="(sales, key) in topSales" :key="key" disabled>
          <PersonCardComponent :person="sales" :to="`/sales-summary/${sales.id}`" class="pa-2" style="width: 300px;">
            <template v-slot:subtitle>
              <v-chip v-if="sales.inHouse" color="green">in house</v-chip>
              <v-chip v-else color="blue">freelance</v-chip>
              <p>{{ sales.location }}</p>
            </template>
            <v-progress-linear v-model="sales.targetRealization"></v-progress-linear>
          </PersonCardComponent>
        </v-slide-group-item>
      </v-slide-group>
    </section>

    <section class="my-8">
      <h2>Top Customer</h2>
      <v-slide-group show-arrows>
        <v-slide-group-item v-for="(customer, key) in topCustomer" :key="key" disabled>
          <PersonCardComponent :person="customer" :to="`/customer-summary/${customer.id}`" class="pa-2"
            style="width: 300px;">
            <template v-slot:subtitle>
              <p>{{ customer.email }}</p>
              <p>{{ customer.location }}</p>
            </template>
            <v-chip color="violet">{{ customer.activityTotalScores }}</v-chip>
          </PersonCardComponent>
        </v-slide-group-item>
      </v-slide-group>
    </section>
  </div>
</template>

<script lang="ts" setup>
import PersonCardComponent from '@/shared/components/person-card-component.vue';
import { ref } from 'vue';
import Chart from 'primevue/chart';

const chartData = ref({
  labels: ['education', 'analytic', 'campaign'],
  datasets: [{
    data: [3580, 2450, 6955],
    backgroundColor: ["#79c2d0", "#118a7e", "#f5dd7b"],
    hoverBackgroundColor: ["#bbe4e9", "#3baea0", "#fde994"],
  }]
})
const chartOptions = ref({
  cutout: '60%'
});

const articleChartData = ref()

const productSummary = ref([
  {
    id: 1, name: 'education', totalAccessScore: 2645, articles: [
      { id: 1, name: 'introduction', totalAccessScore: 750 },
      { id: 2, name: 'what is forex', totalAccessScore: 1245 },
      { id: 3, name: 'benefit', totalAccessScore: 2365 },
    ]
  },
  {
    id: 2, name: 'analytics', totalAccessScore: 1345, articles: [
      { id: 1, name: 'decision making', totalAccessScore: 1754 },
      { id: 2, name: 'when to buy', totalAccessScore: 765 },
      { id: 3, name: 'when to sell', totalAccessScore: 835 }
    ]
  },
  {
    id: 3, name: 'campaign', totalAccessScore: 775, articles: [
      { id: 1, name: 'free consultation', totalAccessScore: 1754 },
      { id: 2, name: 'seminar', totalAccessScore: 765 },
      { id: 3, name: 'free training', totalAccessScore: 835 }
    ]
  },
]);
const topSales = ref([
  { id: 1, name: 'sales one', location: 'Bandung', targetRealization: 100, inHouse: true },
  { id: 2, name: 'sales two', location: 'Bandung', targetRealization: 90, inHouse: true },
  { id: 3, name: 'sales three', location: 'Jakarta', targetRealization: 90, inHouse: false },
  { id: 4, name: 'sales four', location: 'Bandung', targetRealization: 80, inHouse: true },
  { id: 5, name: 'sales five', location: 'Semarang', targetRealization: 60, inHouse: false }
]);
const topCustomer = ref([
  { id: 1, name: 'customer one', email: "customerOne@email.org", location: 'Bandung', activityTotalScores: 1025 },
  { id: 2, name: 'customer two', email: "customerTwo@email.org", location: 'Jakarta', activityTotalScores: 880 },
  { id: 3, name: 'customer three', email: "customerThree@email.org", location: 'Bandung', activityTotalScores: 800 },
  { id: 4, name: 'customer four', email: "customerFour@email.org", location: 'Semarang', activityTotalScores: 780 },
  { id: 5, name: 'customer five', email: "customerFive@email.org", location: 'Bandung', activityTotalScores: 650 },
]);

const productSelected = () => {
  articleChartData.value = {
    labels: ['introduction', 'what is forex', 'benefit of joining us'],
    datasets: [{
      data: [635, 1035, 875],
      backgroundColor: ["#79c2d0", "#118a7e", "#f5dd7b"],
      hoverBackgroundColor: ["#bbe4e9", "#3baea0", "#fde994"],
    }]
  }
}
</script>

<script lang="ts">
export default {
  name: 'ManagerDashboard',
}
</script>

<style lang="scss" scoped></style>