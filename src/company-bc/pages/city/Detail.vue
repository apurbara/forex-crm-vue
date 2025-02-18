<template>
  <div class="page-section">
    <h1 class="page-title">City Detail</h1>
    <div class="d-flex justify-end"></div>
    <div class="form">
      <div class="d-flex justify-end">
        <v-btn variant="tonal" v-if="!editing" @click="editing = !editing">Edit</v-btn>
        <v-btn variant="tonal" v-else @click="cancelEdit">Cancel</v-btn>
      </div>
      <CityComponent :city="city" :readonly="!editing" />
      <v-autocomplete
        label="province"
        variant="outlined"
        :items="provinceList"
        density="compact"
        item-title="name"
        return-object
        v-model="city.province"
        :readonly="!editing"
      />
      <div class="d-flex justify-end" v-if="editing">
        <v-btn :disabled="!city.isValidEntity()" @click="update">Update</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ProvinceType } from "@/company-bc/domain/model/province";
import City, { CityType } from "@/company-bc/domain/model/province/city";
import CityComponent from "@/company-bc/domain/model/province/CityComponent.vue";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { onMounted, reactive, ref } from "vue";

const { companyUserRepository, cache } = useDependencyInjection();

const city = reactive(new City());
const props = defineProps<{ cityId: string }>();
let editing = ref(false);
let cacheData: CityType;
const provinceList = ref<ProvinceType[]>([]);

onMounted(async () => {
  cacheData = cache?.pull<CityType>(`city-${props.cityId}`);
  if (cacheData) {
    city.load(cacheData);
  } else {
    const response = await companyUserRepository
      .getUser()!
      .executeGraphqlQueryInCompany<{ viewCityDetail: CityType }>({
        operation: "viewCityDetail",
        variables: { id: { type: "ID!", value: props.cityId } },
        fields: ["id", "disabled", "createdTime", "name", { province: ["id", "name"] }],
      });
    cacheData = response.viewCityDetail;
    city.load(cacheData);
  }

  const provinceResponse = await companyUserRepository
    .getUser()!
    .executeGraphqlQueryInCompany<{ viewAllProvince: ProvinceType[] }>({
      operation: "viewAllProvince",
      variables: {
        filters: { type: "[FilterInput]", value: [{ column: "Province.disabled", value: false }] },
      },
      fields: ["id", "name"],
    });
  provinceList.value = provinceResponse.viewAllProvince;
});

const update = async () => {
  const response = await companyUserRepository
    .getUser()!
    .executeGraphqlMutationInCompany<{ updateCity: CityType }>({
      operation: "updateCity",
      variables: city.toGraphqlVariables(),
      fields: ["name", { province: ["id", "name"] }],
    });
  city.load(response.updateCity);
  cacheData = { ...cacheData, ...response.updateCity };
  editing.value = false;
};

const cancelEdit = () => {
  city.load(cacheData);
  editing.value = false;
};
</script>

<style lang="scss" scoped></style>
