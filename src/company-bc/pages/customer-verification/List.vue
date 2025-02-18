<template>
  <div class="page-section">
    <h1 class="page-title">Customer Verification List</h1>
    <OffsetPaginationComponent :pagination="pagination">
      <template v-slot:editSection>
        <v-btn
          class="ml-2"
          prepend-icon="mdi-account-plus-outline"
          variant="tonal"
          to="/company/customer-verification/add"
          >Add Customer Verification</v-btn
        >
      </template>
      <EmptyDataIllustrationComponent
        class="w-full"
        v-if="pagination.resultList.length < 1"
        message="Data Customer Verification Kosong"
      />
      <DataTable v-else :value="pagination.resultList" size="small" class="w-full">
        <Column field="name" header="Name"></Column>
        <Column field="weight" header="Bobot"></Column>
        <Column field="position" header="Posisi"></Column>
        <Column>
          <template #body="{ data }">
            <DataTableActionComponent
              :value="data.disabled"
              :detail-path="`/company/customer-verification/${data.id}`"
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
import { CustomerVerificationType } from "@/company-bc/domain/model/customer-verification";
import EmptyDataIllustrationComponent from "@/shared/components/EmptyDataIllustrationComponent.vue";
import DataTableActionComponent from "@/shared/components/data-table-action-component.vue";

const { companyUserRepository } = useDependencyInjection();
const router = useRouter();
const confirm = useConfirm();

const pagination = reactive(
  new OffsetPagination<CustomerVerificationType>(
    async (pagination) => {
      const response = await companyUserRepository.getUser()!.executeGraphqlQueryInCompany<{
        customerVerificationList: PaginationResponseType<CustomerVerificationType>;
      }>({
        operation: "customerVerificationList",
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields(["id", "name", "weight", "position", "disabled"]),
      })!;
      return response.customerVerificationList;
    },
    [
      new EnumFilter(
        "status",
        "CustomerVerification.disabled",
        () => [
          { label: "active", value: false },
          { label: "disabled", value: true },
        ],
        "select status ..."
      ),
    ],
    new KeywordSearch(["CustomerVerification.name", "CustomerVerification.description"])
  )
);

onMounted(async () => {
  await pagination.loadPage();
});

const disableCallback = (customerVerificationId: string) => async () => {
  const response = await companyUserRepository
    .getUser()!
    .executeGraphqlMutationInCompany<{ disableCustomerVerification: CustomerVerificationType }>({
      operation: "disableCustomerVerification",
      variables: { id: { type: "ID", value: customerVerificationId } },
      fields: ["disabled"],
    });
  pagination.resultList.find(
    (customerVerification: CustomerVerificationType) =>
      customerVerification.id === customerVerificationId
  )!.disabled = response.disableCustomerVerification.disabled;
};

const enableCallback = (customerVerificationId: string) => async () => {
  const response = await companyUserRepository
    .getUser()!
    .executeGraphqlMutationInCompany<{ enableCustomerVerification: CustomerVerificationType }>({
      operation: "enableCustomerVerification",
      variables: { id: { type: "ID", value: customerVerificationId } },
      fields: ["disabled"],
    });
  pagination.resultList.find(
    (customerVerification: CustomerVerificationType) =>
      customerVerification.id === customerVerificationId
  )!.disabled = response.enableCustomerVerification.disabled;
};
</script>

<style lang="scss" scoped></style>
