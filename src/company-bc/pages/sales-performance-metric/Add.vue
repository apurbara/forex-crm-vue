<template>
  <div class="page-section">
    <h1 class="page-title">Add Metric</h1>
    <div class="form">
      <SalesPerformanceMetricComponent :sales-performance-metric="salesPerformanceMetric" />
      <div class="d-flex justify-end">
        <v-btn :disabled="!salesPerformanceMetric.isValidProperties()" @click="submit"
          >Submit</v-btn
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SalesPerformanceMetricComponent from "@/company-bc/domain/model/SalesPerformanceMetricComponent.vue";
import SalesPerformanceMetric, {
  SalesPerformanceMetricType,
} from "@/company-bc/domain/model/sales-performance-metric";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { reactive } from "vue";
import { useRouter } from "vue-router";

const salesPerformanceMetric = reactive(new SalesPerformanceMetric());

const { companyUserRepository, cache } = useDependencyInjection();
const router = useRouter();

const submit = async () => {
  const response = await companyUserRepository
    .getUser()!
    .executeGraphqlMutationInCompany<{ createSalesPerformanceMetric: SalesPerformanceMetricType }>({
      operation: "createSalesPerformanceMetric",
      variables: salesPerformanceMetric.toGraphqlVariables(),
      fields: [
        ...["id", "disabled", "lastModifiedTime", "name"],
        ...["metricType", "recurrenceType", "recurrenceCount"],
        { evaluations: ["alias", "evaluationType"] },
      ],
    });
  cache?.set(
    `sales-performance-metric-${response?.createSalesPerformanceMetric.id}`,
    response?.createSalesPerformanceMetric
  );
  router.push(`/company/sales-performance-metric/${response?.createSalesPerformanceMetric.id}`);
};
</script>

<style lang="scss" scoped></style>
