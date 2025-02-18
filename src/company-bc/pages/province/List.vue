<template>
  <div class="page-section">
    <h1 class="page-title">Province List</h1>
    <OffsetPaginationComponent :pagination="pagination">
      <template v-slot:editSection>
        <v-btn
          class="ml-2"
          prepend-icon="mdi-account-plus-outline"
          variant="tonal"
          to="/company/province/add"
          >Add Province</v-btn
        >
      </template>
      <EmptyDataIllustrationComponent
        class="w-full"
        v-if="pagination.resultList.length < 1"
        message="Data Sales Activity Kosong"
      />
      <DataTable v-else :value="pagination.resultList" size="small" class="w-full">
        <Column field="name" header="Name"></Column>
        <Column>
          <template #body="{ data }">
            <DataTableActionComponent
              :value="data.disabled"
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
import { ProvinceType } from "@/company-bc/domain/model/province";
import DataTableActionComponent from "@/shared/components/data-table-action-component.vue";
import EmptyDataIllustrationComponent from "@/shared/components/EmptyDataIllustrationComponent.vue";

const { companyUserRepository } = useDependencyInjection();
const router = useRouter();
const confirm = useConfirm();

const pagination = reactive(
  new OffsetPagination<ProvinceType>(
    async (pagination) => {
      const response = await companyUserRepository
        .getUser()!
        .executeGraphqlQueryInCompany<{ viewProvinceList: PaginationResponseType<ProvinceType> }>({
          operation: "viewProvinceList",
          variables: pagination.toGraphqlVariables(),
          fields: OffsetPagination.wrapResultFields(["id", "name", "disabled"]),
        })!;
      return response.viewProvinceList;
    },
    [
      new EnumFilter(
        "status",
        "Province.disabled",
        () => [
          { label: "active", value: false },
          { label: "disabled", value: true },
        ],
        "select status ..."
      ),
    ],
    new KeywordSearch(["Province.name"])
  )
);

onMounted(async () => {
  await pagination.loadPage();
});

const disableCallback = (provinceId: string) => async () => {
  const response = await companyUserRepository
    .getUser()!
    .executeGraphqlMutationInCompany<{ disableProvince: ProvinceType }>({
      operation: "disableProvince",
      variables: { id: { type: "ID", value: provinceId } },
      fields: ["disabled"],
    });
  pagination.resultList.find((province: ProvinceType) => province.id === provinceId)!.disabled =
    response.disableProvince.disabled;
};

const enableCallback = (provinceId: string) => async () => {
  const response = await companyUserRepository
    .getUser()!
    .executeGraphqlMutationInCompany<{ enableProvince: ProvinceType }>({
      operation: "enableProvince",
      variables: { id: { type: "ID", value: provinceId } },
      fields: ["disabled"],
    });
  pagination.resultList.find((province: ProvinceType) => province.id === provinceId)!.disabled =
    response.enableProvince.disabled;
};
</script>

<style lang="scss" scoped></style>
