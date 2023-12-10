<template>
  <section class="page-section">
    <h2 class="section-title">Sales Activity History</h2>
    <div class="card-list">
      <ItemCardComponent class="ma-2" style="min-height: 150px; width: 300px;"
        v-for="(schedule, key) in assignedCustomer.completedSchedules()" :key="key" :item="{
          name: schedule.salesActivity.label.name,
          description: schedule.salesActivity.label.description
        }">
        <template v-slot>
          <p>{{ schedule.startTime }} - {{ schedule.endTime }}</p>
          <div class="d-flex justify-end">
            <v-btn v-if="!!schedule.salesActivityReport.id"
              @click="showReportContent($event, schedule.salesActivityReport)">view report</v-btn>
          </div>
        </template>
      </ItemCardComponent>
    </div>
  </section>

  <OverlayPanel ref="op" showCloseIcon style="width: 600px;">
    <div class="pa-4">{{ selectedReport?.content }}</div>
    <div class="pa-4">submit time: {{ selectedReport?.submitTime }}</div>
  </OverlayPanel>
</template>

<script lang="ts" setup>

import OverlayPanel from 'primevue/overlaypanel';

import AssignedCustomer from '@/domain/model/personnel/manager/sales/assigned-customer';
import SalesActivityReport from '@/domain/model/personnel/manager/sales/assigned-customer/sales-activity-schedule/sales-activity-report';
import ItemCardComponent from '@/shared/components/item-card-component.vue';
import { ref } from 'vue';

const props = defineProps<{ assignedCustomer: AssignedCustomer }>()

const op = ref()
const selectedReport = ref<SalesActivityReport>()
const showReportContent = (event: any, salesActivityReport: SalesActivityReport) => {
  op.value.toggle(event)
  selectedReport.value = salesActivityReport
}

</script>

<style lang="scss" scoped></style>