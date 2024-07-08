<template>
  <div>
    <h1 class="page-title">Add Province</h1>
    <div class="form">
      <ProvinceComponent :province="province" />
      <div class="d-flex justify-end">
        <v-btn :disabled="!province.isValidEntity()" @click="submit">Submit</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Province, { ProvinceType } from '@/company-bc/domain/model/province';
import ProvinceComponent from '@/company-bc/domain/model/ProvinceComponent.vue';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const province = reactive(new Province());

const { companyUserRepository, cache } = useDependencyInjection()
const router = useRouter()


const submit = async () => {
  await companyUserRepository.getUser()!
    .executeGraphqlMutationInCompany<{ addProvince: ProvinceType }>({
      operation: 'addProvince',
      variables: province.toGraphqlVariables(),
      fields: ["id"]
    })
  router.push(`/province`)
}

</script>

<style lang="scss" scoped></style>