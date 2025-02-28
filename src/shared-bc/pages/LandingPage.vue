<template>
</template>

<script lang="ts" setup>
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { useRouter } from 'vue-router';

const router = useRouter();
const { companyUserRepository } = useDependencyInjection();
router.replace(companyUserRepository.getUser()?.getLandingPage() ?? '/login')
</script>

<style lang="scss" scoped></style>