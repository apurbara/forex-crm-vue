<template>
  <div>
    <div class="d-flex justify-space-between ma-2 pa-0">
      <div>Admin List</div>
      <v-btn to="/admin/add">add admin</v-btn>
    </div>
    <PaginationComponent class="ma-2 pa-0" :pagination="adminList">
      <v-row class="py-4">
        <v-col v-for="(admin, index) in adminList.list" cols="12" sm="4" md="3" :key="admin.id ?? index">
          <PersonCardComponent :person="admin" :to="`/admin/${admin.id}`"></PersonCardComponent>
          <!-- <PersonCardComponent :person="admin" @click="$router.push(`/admin/${admin.id}`)" pointer-cursor></PersonCardComponent> -->
        </v-col>
      </v-row>
    </PaginationComponent>
  </div>
</template>

<script lang="ts" setup>
import HttpRequestInterface from '@/domain/http-request-interface';
import { AdminListDataInterface } from '@/domain/model/admin';
import UserRepository from '@/domain/user-repository';
import PaginationComponent from '@/resources/components/PaginationComponent.vue';
import Pagination from '@/resources/components/pagination';
import PersonCardComponent from '@/shared/components/person-card-component.vue';
import { inject, reactive } from 'vue';

const httpRequest = inject<HttpRequestInterface>('httpRequest')!;
const user = inject<UserRepository>('userRepository')?.getUser()!;

const adminList = reactive(new Pagination<AdminListDataInterface>(
  async (pagination: Pagination<AdminListDataInterface>) =>
    await user.submitGetRequest(httpRequest, '/admin', pagination.getQueryParameters())
))
adminList.init();


</script>

<style lang="scss" scoped></style>