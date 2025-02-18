<template>
  <div class="page-section">
    <h1 class="page-title">Customer Journey List</h1>
    <OffsetPaginationComponent :pagination="pagination">
      <template v-slot:editSection>
        <v-btn
          prepend-icon="mdi-account-plus-outline"
          variant="tonal"
          to="/company/customer-journey/set-initial"
          >Set Initial Customer Journey</v-btn
        >
        <v-btn
          class="ml-2"
          prepend-icon="mdi-account-plus-outline"
          variant="tonal"
          to="/company/customer-journey/add"
          >Add Customer Journey</v-btn
        >
      </template>
      <EmptyDataIllustrationComponent
        class="w-full"
        v-if="pagination.resultList.length < 1"
        message="Data Customer Verification Kosong"
      />
      <DataTable v-else :value="pagination.resultList" size="small" class="w-full">
        <Column field="name" header="Name"></Column>
        <Column field="initial" header="Initial"></Column>
        <Column field="description" header="Description"></Column>
        <Column>
          <template #body="{ data }">
            <DataTableActionComponent
              :value="data.disabled"
              :detail-path="`/company/customer-journey/${data.id}`"
              :enable-callback="enableCallback(data.id)"
              :enable-message="`do you really want to enable ${data.name}`"
              :disable-callback="disableCallback(data.id)"
              :disable-message="`do you really want to disable ${data.name}`"
            />
          </template>
        </Column>
      </DataTable>
    </OffsetPaginationComponent>
  </div>
</template>

<script lang="ts" setup>
import OffsetPaginationComponent from "@/resources/components/OffsetPaginationComponent.vue";
import { KeywordSearch, PaginationResponseType } from "@/resources/components/abstract-pagination";
import OffsetPagination from "@/resources/components/offset-pagination";
import EnumFilter from "@/resources/components/pagination/enum-filter";
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { CustomerJourneyType } from "@/company-bc/domain/model/customer-journey";
import EmptyDataIllustrationComponent from "@/shared/components/EmptyDataIllustrationComponent.vue";
import DataTableActionComponent from "@/shared/components/data-table-action-component.vue";

const { companyUserRepository } = useDependencyInjection();
const router = useRouter();
const confirm = useConfirm();

const pagination = reactive(
  new OffsetPagination<CustomerJourneyType>(
    async (pagination) => {
      const response = await companyUserRepository.getUser()!.executeGraphqlQueryInCompany<{
        customerJourneyList: PaginationResponseType<CustomerJourneyType>;
      }>({
        operation: "customerJourneyList",
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields([
          ...["id", "name", "initial", "description", "disabled"],
        ]),
      })!;
      return response.customerJourneyList;
    },
    [
      new EnumFilter(
        "status",
        "CustomerJourney.disabled",
        () => [
          { label: "active", value: false },
          { label: "disabled", value: true },
        ],
        "select status ..."
      ),
    ],
    new KeywordSearch(["CustomerJourney.name", "CustomerJourney.description"])
  )
);

onMounted(async () => {
  await pagination.loadPage();
});
const disableCallback = (customerJourneyId: string) => async () => {
  const response = await companyUserRepository.getUser()!.executeGraphqlMutationInCompany<{
    disableCustomerJourney: CustomerJourneyType;
  }>({
    operation: "disableCustomerJourney",
    variables: { id: { type: "ID", value: customerJourneyId } },
    fields: ["disabled"],
  });
  pagination.resultList.find(
    (customerJourney: CustomerJourneyType) => customerJourney.id === customerJourneyId
  )!.disabled = response.disableCustomerJourney.disabled;
};

const enableCallback = (customerJourneyId: string) => async () => {
  const response = await companyUserRepository.getUser()!.executeGraphqlMutationInCompany<{
    enableCustomerJourney: CustomerJourneyType;
  }>({
    operation: "enableCustomerJourney",
    variables: { id: { type: "ID", value: customerJourneyId } },
    fields: ["disabled"],
  });
  pagination.resultList.find(
    (customerJourney: CustomerJourneyType) => customerJourney.id === customerJourneyId
  )!.disabled = response.enableCustomerJourney.disabled;
};
</script>

<style lang="scss" scoped></style>
