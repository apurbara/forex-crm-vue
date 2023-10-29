<template>
  <div>
  </div>
</template>

<script lang="ts" setup>
import UserRepository from '@/domain/user-repository';
import { UserRoleInterface } from '@/domain/user-role/role-interfaces';
import { inject } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
router.replace(inject<UserRepository>('userRepository')?.getUser<UserRoleInterface>().getLandingPage()!)
</script>

<style lang="scss" scoped></style>