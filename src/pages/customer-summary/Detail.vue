<template>
  <div class="pa-4">
    <section>
      <v-card class="d-flex justify-start align-center" variant="text">
        <v-avatar size="75" :image="'https://i.pravatar.cc/100'" class="mx-2"></v-avatar>
        <v-card-item>
          <v-card-title>{{ customer.name }}</v-card-title>
          <v-card-subtitle> <v-icon size="small" icon="mdi-email-outline" class="mr-2" />{{ customer.email
          }}</v-card-subtitle>
          <v-card-subtitle> <v-icon size="small" icon="mdi-phone-classic" class="mr-2" />{{ customer.phone
          }}</v-card-subtitle>
          <v-card-subtitle> <v-icon size="small" icon="mdi-map-marker" class="mr-2" />{{ customer.location
          }}</v-card-subtitle>
        </v-card-item>
      </v-card>
    </section>

    <section class="my-4">
      <h2>Activity</h2>
      <div class="d-flex justify-space-around align-center">
        <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full md:w-30rem" />
        <v-table>
          <thead>
            <tr>
              <th>read article</th>
              <th>access time</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(activity, i) in customer.activityLog" :key="activity.id ?? i">
              <td>{{ activity.article.name }}</td>
              <td>{{ activity.time }}</td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </section>

    <section class="my-4">
      <h2>Managing Sales</h2>
      <v-row>
        <v-col cols="3" v-for="(managingSales, i) in customer.managingSalesList" :key="customer.id ?? i">
          <PersonCardComponent :person="managingSales.sales">
            <template v-slot:subtitle>
              <v-chip v-if="managingSales.disabled" color="red">disabled</v-chip>
              <v-chip v-else="managingSales.disabled" color="green">active</v-chip>
            </template>
          </PersonCardComponent>
        </v-col>
      </v-row>
    </section>

    <section class="my-4">
      <h2>Sales Mission Report</h2>
      <v-table>
        <thead>
          <tr>
            <th>Sales</th>
            <th>report time</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(missionReport, i) in customer.salesMissionReportHistory" :key="missionReport.id ?? i"
            @click="$router.push(`/sales-mission-report/${missionReport.id}`)" style="cursor: pointer;">
            <td>{{ missionReport.managingSalesReporter.sales.name }}</td>
            <td>{{ missionReport.reportTime }}</td>
          </tr>
        </tbody>
      </v-table>
      <div class="d-flex justify-center">
        <v-btn color="success" to="/sales-mission-report/submit">submit report</v-btn>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import HttpRequestInterface from '@/domain/http-request-interface';
import { ComprehensiveCustomerDataInterface } from '@/domain/model/customer';
import UserRepository from '@/domain/user-repository';
import PersonCardComponent from '@/shared/components/person-card-component.vue';
import { ref } from 'vue';
import { inject } from 'vue';
import Chart from 'primevue/chart';

const props = defineProps<{ customerId: string }>()
const httpRequest = inject<HttpRequestInterface>('httpRequest')!;
const user = inject<UserRepository>('userRepository')?.getUser()!;

const chartData = ref();
const chartOptions = ref({
  cutout: '60%'
});

const customer = ref<ComprehensiveCustomerDataInterface>({})
user.submitGetRequest<ComprehensiveCustomerDataInterface>(httpRequest, `/customer-summary/${props.customerId}`)
  .then((res) => {
    customer.value = res
    const labels: Array<string> = [];
    const data: Array<number> = [];
    const backgroundColor: Array<string> = [];
    const hoverBackgroundColor: Array<string> = [];

    const backgroundColorSchema = ["#79c2d0", "#118a7e", "#f5dd7b", "#ff6f3c", "#c50000", "#6643b5"]
    const hoverBackgroundColorSchema = ["#bbe4e9", "#3baea0", "#fde994", "#ff9a3c", "#e70000", "#8594e4"]

    const activityScoreDistribution = customer.value.activityScoreDistributions!
    let key = 0
    const totalAccessedProduct = Object.keys(activityScoreDistribution).length;
    for (const product in activityScoreDistribution) {
      labels.push(product);
      data.push(activityScoreDistribution[product])

      backgroundColor.push(backgroundColorSchema[key % totalAccessedProduct])
      hoverBackgroundColor.push(hoverBackgroundColorSchema[key % totalAccessedProduct])
      key++
    }

    chartData.value = {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: backgroundColor,
        hoverBackgroundColor: hoverBackgroundColor,
      }]
    }
  })

</script>

<style lang="scss" scoped></style>