<template>
  <div class="page-section">
    <h1 class="page-title">Customer Journey Detail</h1>
    <div class="d-flex justify-end"></div>
    <div class="form">
      <div class="d-flex justify-end">
        <v-btn variant="tonal" v-if="!editing" @click="editing = !editing">Edit</v-btn>
        <v-btn variant="tonal" v-else @click="cancelEdit">Cancel</v-btn>
      </div>
      <CustomerJourneyComponent :customer-journey="customerJourney" :readonly="!editing" />
      <div class="d-flex justify-end" v-if="editing">
        <v-btn :disabled="!customerJourney.isValidProperties()" @click="update">Update</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CustomerJourneyComponent from "@/company-bc/domain/model/CustomerJourneyComponent.vue";
import CustomerJourney, { CustomerJourneyType } from "@/company-bc/domain/model/customer-journey";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { onMounted, reactive, ref } from "vue";

const { companyUserRepository, cache } = useDependencyInjection();

const customerJourney = reactive(new CustomerJourney());
const props = defineProps<{ customerJourneyId: string }>();
let editing = ref(false);
let cacheData: CustomerJourneyType;

onMounted(async () => {
  cacheData = cache?.pull<CustomerJourneyType>(`customer-journey-${props.customerJourneyId}`);
  if (cacheData) {
    customerJourney.load(cacheData);
  } else {
    const response = await companyUserRepository
      .getUser()!
      .executeGraphqlQueryInCompany<{ customerJourneyDetail: CustomerJourneyType }>({
        operation: "customerJourneyDetail",
        variables: { id: { type: "ID!", value: props.customerJourneyId } },
        fields: ["id", "disabled", "createdTime", "initial", "name", "description"],
      });
    cacheData = response.customerJourneyDetail;
    customerJourney.load(cacheData);
  }
});

const update = async () => {
  const response = await companyUserRepository
    .getUser()!
    .executeGraphqlMutationInCompany<{ updateCustomerJourney: CustomerJourneyType }>({
      operation: "updateCustomerJourney",
      variables: customerJourney.toGraphqlVariables(),
      fields: ["name", "description"],
    });
  customerJourney.load(response.updateCustomerJourney);
  cacheData = { ...cacheData, ...response.updateCustomerJourney };
  editing.value = false;
};

const cancelEdit = () => {
  customerJourney.load(cacheData);
  editing.value = false;
};
</script>

<style lang="scss" scoped></style>
