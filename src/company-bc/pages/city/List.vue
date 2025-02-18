<template>
  <div class="page-section">
    <h1 class="page-title">City List</h1>
    <OffsetPaginationComponent :pagination="pagination">
      <template v-slot:editSection>
        <v-btn
          class="ml-2"
          prepend-icon="mdi-account-plus-outline"
          variant="tonal"
          to="/company/city/add"
          >Add City</v-btn
        >
      </template>
      <EmptyDataIllustrationComponent
        class="w-full"
        v-if="pagination.resultList.length < 1"
        message="Data Sales Activity Kosong"
      />
      <DataTable v-else :value="pagination.resultList" size="small" class="w-full">
        <Column field="name" header="Name"></Column>
        <Column :field="(city) => city.province.name" header="Province"></Column>
        <Column>
          <template #body="{ data }">
            <DataTableActionComponent
              :value="data.disabled"
              :detail-path="`/company/city/${data.id}`"
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
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { CityType } from "@/company-bc/domain/model/province/city";
import DataTableActionComponent from "@/shared/components/data-table-action-component.vue";
import EmptyDataIllustrationComponent from "@/shared/components/EmptyDataIllustrationComponent.vue";

const { companyUserRepository } = useDependencyInjection();

const pagination = reactive(
  new OffsetPagination<CityType>(
    async (pagination) => {
      const response = await companyUserRepository
        .getUser()!
        .executeGraphqlQueryInCompany<{ viewCityList: PaginationResponseType<CityType> }>({
          operation: "viewCityList",
          variables: pagination.toGraphqlVariables(),
          fields: OffsetPagination.wrapResultFields(["id", "name", { province: ["name"] }]),
        })!;
      return response.viewCityList;
    },
    [
      new EnumFilter(
        "status",
        "City.disabled",
        () => [
          { label: "active", value: false },
          { label: "disabled", value: true },
        ],
        "select status ..."
      ),
      // new EnumFilter('disabled', 'City.disabled', () => [{ status: true, name: 'disabled' }, { status: false, name: 'active' }], 'IN', undefined, 'name', 'status'),
    ],
    new KeywordSearch(["City.name"])
  )
);

onMounted(async () => {
  await pagination.loadPage();
});

const disableCallback = (cityId: string) => async () => {
  const response = await companyUserRepository
    .getUser()!
    .executeGraphqlMutationInCompany<{ disableCity: CityType }>({
      operation: "disableCity",
      variables: { id: { type: "ID", value: cityId } },
      fields: ["disabled"],
    });
  pagination.resultList.find((city: CityType) => city.id === cityId)!.disabled =
    response.disableCity.disabled;
};

const enableCallback = (cityId: string) => async () => {
  const response = await companyUserRepository
    .getUser()!
    .executeGraphqlMutationInCompany<{ enableCity: CityType }>({
      operation: "enableCity",
      variables: { id: { type: "ID", value: cityId } },
      fields: ["disabled"],
    });
  pagination.resultList.find((city: CityType) => city.id === cityId)!.disabled =
    response.enableCity.disabled;
};
</script>

<style lang="scss" scoped></style>
