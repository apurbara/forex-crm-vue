<template>
</template>

<script lang="ts" setup>
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { useRouter } from 'vue-router';

const router = useRouter();
const { userRepository } = useDependencyInjection();

router.replace(userRepository.getUser().getLandingPage())
</script>

<style lang="scss" scoped></style>