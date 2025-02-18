<template>
  <div class="page-section">
    <h1 class="page-title">Distribute Customer Assignment</h1>
    <div class="flex justify-between gap-2">
      <div class="flex-1">
        <div class="flex justify-center">
          <h2 class="text-xl text-stone-500 mb-4">Select Customer</h2>
        </div>
        <OffsetPaginationComponent :pagination="customerPagination">
          <v-table height="360px" density="compact" class="datatable">
            <thead>
              <tr>
                <th>
                  <Checkbox v-model="allCustomerSelected" :binary="true" />
                </th>
                <th>name</th>
                <!-- <th>email</th> -->
                <th>phone</th>
                <th>source</th>
                <th>verification score</th>
                <th>created time</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="customerPagination.resultList.length < 1">
                <td class="no-data" colspan="12">
                  <div class="justify-center text-center pa-5">
                    <img src="@/assets/images/image-no-data.svg" alt="No Data" /><br /><br />
                    <span class="text-disabled text-body-1">Data Customer kosong</span>
                  </div>
                </td>
              </tr>
              <tr
                v-else
                v-for="(customer, index) in customerPagination.resultList"
                :key="customer.id ?? index"
              >
                <td>
                  <Checkbox
                    class="border-red-500"
                    v-model="payload.customerList"
                    :value="customer.id"
                  />
                </td>
                <td>{{ customer.name }}</td>
                <!-- <td>{{ customer.email }}</td> -->
                <td>{{ customer.phone }}</td>
                <td>{{ customer.source }}</td>
                <td>{{ customer.verificationScore }}</td>
                <td>{{ new Date(customer.createdTime!).toLocaleDateString() }}</td>
              </tr>
            </tbody>
          </v-table>
        </OffsetPaginationComponent>
      </div>
      <div class="w-4/10">
        <div class="flex justify-center">
          <h2 class="text-xl text-stone-500 mb-4">Select Sales</h2>
        </div>
        <OffsetPaginationComponent :pagination="salesPagination">
          <v-table height="360px" density="compact" style="width: 100%" class="datatable">
            <thead>
              <tr>
                <th>
                  <Checkbox v-model="allSalesSelected" :binary="true" />
                </th>
                <th>name</th>
                <th>email</th>
                <th>type</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="salesPagination.resultList.length < 1">
                <td class="no-data" colspan="12">
                  <div class="justify-center text-center pa-5">
                    <img src="@/assets/images/image-no-data.svg" alt="No Data" /><br /><br />
                    <span class="text-disabled text-body-1">Data Sales kosong</span>
                  </div>
                </td>
              </tr>
              <tr
                v-else
                v-for="(sales, index) in salesPagination.resultList"
                :key="sales.id ?? index"
              >
                <td>
                  <Checkbox v-model="payload.salesList" :value="sales.id" />
                </td>
                <td>{{ sales.name }}</td>
                <td>{{ sales.email }}</td>
                <td>{{ sales.type }}</td>
              </tr>
            </tbody>
          </v-table>
        </OffsetPaginationComponent>
      </div>
    </div>
    <div class="form">
      <div class="flex justify-between gap-2 align-center">
        <v-select
          hide-details
          :items="Object.keys(DistributionStrategy)"
          v-model="payload.distributionStrategy"
          label="distribution strategy"
        ></v-select>
        <!-- <v-checkbox
          label="allocate initial schedule"
          v-model="payload.initiateSchedules"
        ></v-checkbox> -->
        <v-btn :disabled="!isValidToSubmit" @click="submit">Submit</v-btn>
      </div>
    </div>
    <!-- {{ payload }} -->
  </div>
</template>

<script setup lang="ts">
import { CustomerType } from "@/company-bc/domain/model/customer";
import { SalesType } from "@/company-bc/domain/model/sales";
import OffsetPaginationComponent from "@/resources/components/OffsetPaginationComponent.vue";
import { KeywordSearch, PaginationResponseType } from "@/resources/components/abstract-pagination";
import OffsetPagination, { OffsetLimit } from "@/resources/components/offset-pagination";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { computed, onMounted, ref, watch } from "vue";
import { reactive } from "vue";
import Checkbox from "primevue/checkbox";
import { useRouter } from "vue-router";

const { companyUserRepository } = useDependencyInjection();
const router = useRouter();

const customerPagination = reactive(
  new OffsetPagination<CustomerType>(
    async (pagination) => {
      let variables: any = pagination.toGraphqlVariables();
      variables["filters"]["value"] = [
        ...variables["filters"]["value"],
        { column: "hasActiveAssignment", value: false, comparisonType: "EQ" },
      ];
      const response = await companyUserRepository
        .getUser()!
        .executeGraphqlQueryInCompany<{ customerList: PaginationResponseType<CustomerType> }>({
          operation: "customerList",
          variables: variables,
          fields: OffsetPagination.wrapResultFields([
            "id",
            "name",
            "email",
            "phone",
            "source",
            "verificationScore",
            "createdTime",
          ]),
        })!;
      return response.customerList;
    },
    [],
    new KeywordSearch(["Customer.name", "Customer.email", "Customer.phone"]),
    new OffsetLimit(100)
  )
);

const salesPagination = reactive(
  new OffsetPagination<SalesType>(
    async (pagination) => {
      let variables: any = pagination.toGraphqlVariables();
      variables["filters"]["value"] = [
        ...variables["filters"]["value"],
        { column: "Sales.contractTerminated", value: false, comparisonType: "EQ" },
      ];
      const response = await companyUserRepository
        .getUser()!
        .executeGraphqlQueryInCompany<{ viewSalesList: PaginationResponseType<SalesType> }>({
          operation: "viewSalesList",
          variables: variables,
          fields: OffsetPagination.wrapResultFields(["id", "type", "name", "email"]),
        })!;
      return response.viewSalesList;
    },
    [],
    new KeywordSearch(["Sales.name", "Sales.email"])
  )
);

onMounted(async () => {
  await customerPagination.loadPage();
  await salesPagination.loadPage();
});

enum DistributionStrategy {
  LOAD_BALANCE_DISTRIBUTION = "LOAD_BALANCE_DISTRIBUTION",
  EVEN_DISTRIBUTION = "EVEN_DISTRIBUTION",
}

interface Payload {
  customerList: string[];
  salesList: string[];
  distributionStrategy: DistributionStrategy;
  initiateSchedules: boolean;
}

const payload: Payload = reactive({
  customerList: [],
  salesList: [],
  distributionStrategy: DistributionStrategy.EVEN_DISTRIBUTION,
  initiateSchedules: false,
});

const allCustomerSelected = ref(false);
const allSalesSelected = ref(false);

watch(allCustomerSelected, (selectAllCustomer) => {
  payload.customerList.length = 0;
  if (selectAllCustomer) {
    customerPagination.resultList.forEach((customer) => {
      payload.customerList.push(customer.id!);
    });
  }
});

watch(allSalesSelected, (selectAllSales) => {
  payload.salesList.length = 0;
  if (selectAllSales) {
    salesPagination.resultList.forEach((sales) => {
      payload.salesList.push(sales.id!);
    });
  }
});

const isValidToSubmit = computed(
  () => payload.customerList.length > 0 && payload.salesList.length > 0
);
const submit = async () => {
  await companyUserRepository.getUser()!.executeGraphqlMutationInCompany({
    operation: "assignMultipleCustomerToMultipleSales",
    variables: {
      customerList: { type: "[ID]", value: payload.customerList },
      salesList: { type: "[ID]", value: payload.salesList },
      distributionStrategy: payload.distributionStrategy,
      initiateSchedules: payload.initiateSchedules,
    },
    fields: [],
  });
  router.push(`/company/customer-assignment`);
};
</script>

<style scoped></style>
