<template>
  <div>
    <div class="flex justify-between gap-2 align-center mb-1">
      <h2 class="font-semibold text-stone-500">Bio</h2>
      <!-- <Badge
        size="large"
        severity="info"
        :value="customerAssignment.customer?.countTotalVerificationWeight()"
      /> -->
      <Badge size="large" severity="info" :value="totalVerificationWeight" />
    </div>
    <div v-if="customerAssignment.customer?.verificationReports?.length">
      <ul class="flex flex-col gap-1">
        <li
          class="text-sm list-disc ml-3"
          v-for="(verificationReport, index) in customerAssignment.customer.verificationReports"
          :key="verificationReport.id ?? index"
        >
          <span>{{ verificationReport.customerVerification?.name }} </span>
          (
          <span
            :class="
              (verificationReport.customerVerification?.weight ?? 1) > 0 ? 'text-green' : 'text-red'
            "
            >{{ verificationReport.customerVerification?.weight }}</span
          >
          )
          {{ verificationReport.note ? ": " : "" }}
          <span class="text-sm text-stone-500">{{ verificationReport.note }}</span>
        </li>
      </ul>
    </div>
    <DataTable
      v-if="unverifiedVerificationList.length > 0"
      :value="unverifiedVerificationList"
      size="small"
      class="w-full text-sm mt-2"
    >
      <Column header="Unverified Bio">
        <template #body="{ data }">
          <p>
            <span>{{ data.name }} </span> :
            <span class="text-stone-400">{{ data.description }} </span>
          </p>
        </template>
      </Column>
      <Column field="weight" header="Bobot"></Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { CustomerVerificationType } from "@/company-bc/domain/model/customer-verification";
import { useCustomerVerificationStore } from "@/company-bc/stores/customer-verification-store";
import { CustomerAssignmentType } from "@/manager-bc/domain/model/manager/sales/customer-assignment";
import { computed, onMounted, ref } from "vue";

const props = defineProps<{ customerAssignment: CustomerAssignmentType }>();
const customerVerificationStore = useCustomerVerificationStore();
const customerVerificationList = ref<CustomerVerificationType[]>();
const totalVerificationWeight = ref(0);

onMounted(async () => {
  customerVerificationList.value =
    await customerVerificationStore.fecthAllActiveCustomerVerificationList();
  totalVerificationWeight.value = (
    props.customerAssignment.customer?.verificationReports ?? []
  ).reduce(
    (acc, verificationReport) => acc + (verificationReport.customerVerification?.weight ?? 0),
    0
  );
});

const unverifiedVerificationList = computed(() => {
  return (
    customerVerificationList.value?.filter(
      (verification) =>
        !(props.customerAssignment.customer?.verificationReports ?? []).find(
          (el) => el.customerVerification?.id === verification.id
        )
    ) ?? []
  );
});
</script>

<style scoped></style>
