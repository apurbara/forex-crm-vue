<template>
  <div class="page-section">
    <h1 class="page-title">Manager List</h1>
    <OffsetPaginationComponent :pagination="pagination">
      <template v-slot:editSection>
        <v-btn
          class="ml-2"
          prepend-icon="mdi-account-plus-outline"
          variant="tonal"
          to="/company/manager/add"
          >Add Manager</v-btn
        >
      </template>
      <EmptyDataIllustrationComponent
        class="w-full"
        v-if="pagination.resultList.length < 1"
        message="Data Manager Kosong"
      />
      <DataTable v-else :value="pagination.resultList" size="small" class="w-full">
        <Column field="name" header="Name"></Column>
        <Column field="email" header="Email"></Column>
        <Column>
          <template #body="{ data }">
            <DataTableActionComponent
              :value="data.suspended"
              :detail-path="`/company/manager/${data.id}`"
              :enable-callback="unsuspendManagerCallback(data.id)"
              enable-message="do you really want to unsuspend manager"
              :disable-callback="suspendManagerCallback(data.id)"
              disable-message="do you really want to suspend manager"
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
import { ManagerType } from "@/company-bc/domain/model/manager";
import EmptyDataIllustrationComponent from "@/shared/components/EmptyDataIllustrationComponent.vue";
import DataTableActionComponent from "@/shared/components/data-table-action-component.vue";

const { companyUserRepository } = useDependencyInjection();
const router = useRouter();
const confirm = useConfirm();

const pagination = reactive(
  new OffsetPagination<ManagerType>(
    async (pagination) => {
      const response = await companyUserRepository.getUser()!.executeGraphqlQueryInCompany<{
        viewManagerList: PaginationResponseType<ManagerType>;
      }>({
        operation: "viewManagerList",
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields(["id", "name", "email", "suspended"]),
      })!;
      return response.viewManagerList;
    },
    [
      new EnumFilter(
        "status",
        "Manager.suspended",
        () => [
          { label: "active", value: false },
          { label: "suspended", value: true },
        ],
        "select status ..."
      ),
    ],
    new KeywordSearch(["Manager.name", "Manager.email"])
  )
);

onMounted(async () => {
  await pagination.loadPage();
});

const suspendManagerCallback = (managerId: string) => {
  return async () => {
    const response = await companyUserRepository
      .getUser()!
      .executeGraphqlMutationInCompany<{ suspendManager: ManagerType }>({
        operation: "suspendManager",
        variables: { id: { type: "ID", value: managerId } },
        fields: ["suspended"],
      });
    pagination.resultList.find((manager: ManagerType) => manager.id === managerId)!.suspended =
      response.suspendManager.suspended;
  };
};

const unsuspendManagerCallback = (managerId: string) => {
  return async () => {
    const response = await companyUserRepository
      .getUser()!
      .executeGraphqlMutationInCompany<{ unsuspendManager: ManagerType }>({
        operation: "unsuspendManager",
        variables: { id: { type: "ID", value: managerId } },
        fields: ["suspended"],
      });
    pagination.resultList.find((manager: ManagerType) => manager.id === managerId)!.suspended =
      response.unsuspendManager.suspended;
  };
};
</script>

<style lang="scss" scoped></style>
