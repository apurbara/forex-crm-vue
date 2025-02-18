<template>
  <div class="page-section">
    <h1 class="page-title">Customer Verification Detail</h1>
    <div class="d-flex justify-end"></div>
    <div class="form">
      <div class="d-flex justify-end">
        <v-btn variant="tonal" v-if="!editing" @click="editing = !editing">Edit</v-btn>
        <v-btn variant="tonal" v-else @click="cancelEdit">Cancel</v-btn>
      </div>
      <CustomerVerificationComponent
        :customer-verification="customerVerification"
        :readonly="!editing"
      />
      <div class="d-flex justify-end" v-if="editing">
        <v-btn :disabled="!customerVerification.isValidProperties()" @click="update">Update</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CustomerVerificationComponent from "@/company-bc/domain/model/CustomerVerificationComponent.vue";
import CustomerVerification, {
  CustomerVerificationType,
} from "@/company-bc/domain/model/customer-verification";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { onMounted, reactive, ref } from "vue";

const { companyUserRepository, cache } = useDependencyInjection();

const customerVerification = reactive(new CustomerVerification());
const props = defineProps<{ customerVerificationId: string }>();
let editing = ref(false);
let cacheData: CustomerVerificationType;

onMounted(async () => {
  cacheData = cache?.pull<CustomerVerificationType>(
    `customer-verification-${props.customerVerificationId}`
  );
  if (cacheData) {
    customerVerification.load(cacheData);
  } else {
    const response = await companyUserRepository
      .getUser()!
      .executeGraphqlQueryInCompany<{ customerVerificationDetail: CustomerVerificationType }>({
        operation: "customerVerificationDetail",
        variables: { id: { type: "ID!", value: props.customerVerificationId } },
        fields: ["id", "disabled", "createdTime", "name", "description", "position", "weight"],
      });
    cacheData = response.customerVerificationDetail;
    customerVerification.load(cacheData);
  }
});

const update = async () => {
  const response = await companyUserRepository
    .getUser()!
    .executeGraphqlMutationInCompany<{ updateCustomerVerification: CustomerVerificationType }>({
      operation: "updateCustomerVerification",
      variables: customerVerification.toGraphqlVariables(),
      fields: ["description", "position", "weight"],
    });
  customerVerification.load(response.updateCustomerVerification);
  cacheData = { ...cacheData, ...response.updateCustomerVerification };
  editing.value = false;
};

const cancelEdit = () => {
  customerVerification.load(cacheData);
  editing.value = false;
};
</script>

<style lang="scss" scoped></style>
