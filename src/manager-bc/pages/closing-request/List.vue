<template>
  <div class="page-section">
    <h1 class="text-2xl mt-2">Closing Request</h1>
    <Tabs v-model:value="tab" class="mt-4">
      <div class="flex gap-4">
        <Card
          class="w-1/6"
          v-for="(item, key) in predefinedFilterCardItems"
          :key="key"
          @click="() => (item.title === tab ? {} : item.action())"
          :class="
            item.title === tab
              ? `!bg-amber-200 drop-shadow-lg scale-105font-semibold`
              : `hover:drop-shadow-md hover:scale-105 hover:cursor-pointer !bg-slate-100`
          "
        >
          <template #content>
            <div class="flex justify-between gap-4">
              <div class="flex flex-col gap-2">
                <p class="text-sm text-grey">{{ item.title }}</p>
                <p class="text-2xl font-semibold">{{ item.total }}</p>
              </div>
              <div
                class="flex size-9 align-center justify-center rounded-lg"
                :class="item.iconBgColor"
              >
                <i :class="item.icon" class="text-xl"></i>
              </div>
            </div>
          </template>
        </Card>
      </div>
      <TabPanels>
        <TabPanel value="Pending">
          <ListPending />
        </TabPanel>
        <TabPanel value="Completed">
          <ListCompleted />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import ListPending from "./ListPending.vue";
import ListCompleted from "./ListCompleted.vue";
import { ManagementApprovalStatus } from "@/shared-bc/domain/enum/management-approval-status";

const route = useRoute();
const { managerRepository } = useDependencyInjection();

const tab = ref<string>("active-assignment");
const pendingRequestCount = ref<number>(0);
const completedRequestCount = ref<number>(0);

onMounted(async () => {
  tab.value = (route.query.tab as string) ?? "Pending";
  await fetchCountSummary();
});

const fetchCountSummary = async () => {
  type ResponseDataType = {
    pendingRequestCount: number;
    completedRequestCount: number;
  };
  const response = await managerRepository.getUser().executeManagerGraphqlQuery<ResponseDataType>([
    {
      operation: { name: "viewClosingRequestCount", alias: "pendingRequestCount" },
      variables: {
        pendingRequestFilters: {
          type: "[FilterInput]",
          name: "filters",
          value: [
            {
              column: "ClosingRequest.status",
              value: ManagementApprovalStatus.WAITING_FOR_APPROVAL,
            },
          ],
        },
      },
      fields: [],
    },
    {
      operation: { name: "viewClosingRequestCount", alias: "completedRequestCount" },
      variables: {
        completedRequestFilters: {
          type: "[FilterInput]",
          name: "filters",
          value: [
            {
              column: "ClosingRequest.status",
              value: ManagementApprovalStatus.WAITING_FOR_APPROVAL,
              comparisonType: "NEQ",
            },
          ],
        },
      },
      fields: [],
    },
  ]);
  predefinedFilterCardItems.find((el) => el.title === "Pending")!.total =
    response.pendingRequestCount;
  predefinedFilterCardItems.find((el) => el.title === "Completed")!.total =
    response.completedRequestCount;
};

const predefinedFilterCardItems = reactive([
  {
    ...{
      title: "Pending",
      icon: "mdi mdi-credit-card-clock-outline",
      iconBgColor: "bg-slate-200",
      total: 0,
    },
    action: () => (tab.value = "Pending"),
  },
  {
    ...{ title: "Completed", icon: "mdi mdi-safe", iconBgColor: "bg-slate-200" },
    ...{ total: 0, action: () => (tab.value = "Completed") },
  },
]);
</script>

<style lang="scss" scoped></style>
