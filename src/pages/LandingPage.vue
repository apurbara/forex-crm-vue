<template>
  <div>
  </div>
</template>

<script lang="ts" setup>
import UserRepository from '@/domain/user-repository';
import { inject } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
router.replace(inject<UserRepository>('userRepository')?.getUser().getLandingPage()!)
</script>

<style lang="scss" scoped></style>