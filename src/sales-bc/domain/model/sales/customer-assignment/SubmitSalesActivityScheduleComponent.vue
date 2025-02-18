<template>
  <div>
    <ProgressSpinner v-if="fetchingSalesActivityListData" />
    <div v-else class="flex justify-between gap-4 align-center" fluid>
      <FloatLabel class="w-1/2" variant="on">
        <Select
          v-model="salesActivitySchedule.salesActivity"
          inputId="sales_activity"
          :options="salesActivityList"
          optionLabel="name"
          class="w-full"
        />
        <label for="sales_activity">Select Activity</label>
      </FloatLabel>
      <FloatLabel variant="on">
        <DatePicker
          id="startTime"
          v-model="salesActivitySchedule.startTime"
          showTime
          hourFormat="24"
          :stepMinute="60"
          fluid
        />
        <label for="startTime">Start Time</label>
      </FloatLabel>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import SalesActivitySchedule from "./salesActivitySchedule";
import { SalesActivityType } from "@/company-bc/domain/model/sales-activity";
import { useSalesActivityStore } from "@/company-bc/stores/sales-activity-store";

defineProps<{ salesActivitySchedule: SalesActivitySchedule }>();
const salesActivityList = ref<SalesActivityType[]>();

const salesActivityStore = useSalesActivityStore();

const fetchingSalesActivityListData = ref(true);
onMounted(async () => {
  salesActivityList.value = await salesActivityStore.fecthAllActiveSalesActivityList();
  //
  fetchingSalesActivityListData.value = false;
});
</script>

<style lang="scss" scoped></style>
