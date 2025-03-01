<template>
  <OffsetPaginationComponent :pagination="pagination">
    <EmptyDataIllustrationComponent
      message="no pending closing request"
      v-if="!pagination.resultList.length"
    />
    <DataTable v-else :value="pagination.resultList" size="small" class="w-full">
      <Column>
        <template #body="{ data }">
          <div class="my-2">
            <div class="flex justify-start gap-6 align-center">
              <p
                class="text-lg font-semibold"
                :class="data.status === ManagementApprovalStatus.REJECTED ? 'text-red-500' : ''"
              >
                {{ data.transactionValue.toLocaleString("id-ID") }}
              </p>
              <p class="text-xs text-slate-400">
                {{ new Date(data.createdTime).toLocaleString("id-ID") }}
              </p>
            </div>
            <div class="flex gap-4 mt-1">
              <div class="flex gap-2 justify-start align-center text-base">
                <span class="mdi mdi-account-tie !text-sm px-1 bg-sky-200 rounded-md"></span>
                <p class="text-nowrap">{{ data.customerAssignment?.customer?.name }}</p>
              </div>
              <div class="flex gap-2 justify-start align-center text-sm text-stone-600">
                <span
                  class="mdi mdi-account-circle-outline !text-base px-1 bg-slate-200 rounded-md"
                ></span>
                <p class="text-nowrap">{{ data.customerAssignment?.sales?.name }}</p>
              </div>
            </div>
            <Tag
              class="!text-xs mt-1"
              :severity="data.status === ManagementApprovalStatus.REJECTED ? 'danger' : 'success'"
              :value="data.status"
              rounded
            />
            <p class="text-sm text-stone-400 mt-2">{{ data.note }}</p>
          </div>
        </template>
      </Column>
    </DataTable>
    <!-- <v-table height="400px" density="compact" style="width: 100%;" class="datatable">
      <thead>
        <tr>
          <th>customer</th>
          <th>sales</th>
          <th>status</th>
          <th>transaction value</th>
          <th>note</th>
          <th>remark</th>
          <th>created time</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="pagination.resultList.length < 1">
          <td class="no-data" colspan="12">
            <div class="justify-center text-center pa-5">
              <img src="@/assets/images/image-no-data.svg" alt="No Data" /><br /><br />
              <span class="text-disabled text-body-1">Data Closing Request kosong</span>
            </div>
          </td>
        </tr>
        <tr v-else v-for="(closingRequest, index) in pagination.resultList" :key="closingRequest.id ?? index"
          @dblclick="toDetail(closingRequest)">
          <td>{{ closingRequest.customerAssignment?.customer?.name }}</td>
          <td>{{ closingRequest.customerAssignment?.sales?.name }}</td>
          <td>{{ closingRequest.status }}</td>
          <td>{{ useThousandSeparator(closingRequest.transactionValue!) }}</td>
          <td>{{ closingRequest.note }}</td>
          <td>{{ closingRequest.remark }}</td>
          <td>{{ new Date(closingRequest.createdTime!).toLocaleDateString() }}</td>
        </tr>
      </tbody>
    </v-table> -->
  </OffsetPaginationComponent>
</template>

<script lang="ts" setup>
import OffsetPaginationComponent from "@/resources/components/OffsetPaginationComponent.vue";
import { PaginationResponseType } from "@/resources/components/abstract-pagination";
import OffsetPagination from "@/resources/components/offset-pagination";
import EnumFilter from "@/resources/components/pagination/enum-filter";
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { ManagementApprovalStatus } from "@/shared-bc/domain/enum/management-approval-status";
import { useThousandSeparator } from "@/resources/composables/typography";
import { ClosingRequestType } from "@/manager-bc/domain/model/manager/sales/customer-assignment/closing-request";

const { managerRepository } = useDependencyInjection();
const router = useRouter();

const pagination = reactive(
  new OffsetPagination<ClosingRequestType>(
    async (pagination) => {
      const response = await managerRepository.getUser().executeManagerGraphqlQuery<{
        closingRequestList: PaginationResponseType<ClosingRequestType>;
      }>({
        operation: "closingRequestList",
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields([
          "id",
          "status",
          "createdTime",
          "transactionValue",
          "note",
          "remark",
          {
            customerAssignment: ["id", { customer: ["name"] }, { sales: ["name"] }],
          },
        ]),
      })!;
      return response.closingRequestList;
    },
    [
      new EnumFilter("status", "ClosingRequest.status", () => [
        { value: ManagementApprovalStatus.APPROVED, label: ManagementApprovalStatus.APPROVED },
        { value: ManagementApprovalStatus.REJECTED, label: ManagementApprovalStatus.REJECTED },
      ]),
    ]
  )
);
pagination.addHiddenFilter({
  column: "ClosingRequest.status",
  value: ManagementApprovalStatus.WAITING_FOR_APPROVAL,
  comparisonType: "NEQ",
});

onMounted(async () => {
  await pagination.loadPage();
});

const toDetail = (closingRequest: ClosingRequestType) =>
  router.push(`/manager-customer-assignment/${closingRequest.customerAssignment?.id}`);
</script>

<style lang="scss" scoped></style>
