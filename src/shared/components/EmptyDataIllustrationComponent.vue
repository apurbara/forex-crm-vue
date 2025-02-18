<template>
  <div class="flex flex-col justify-center align-center mt-10 mb-4">
    <!-- <div class="!w-1/4"> -->
    <div class="flex justify-center align-center !w-1/4">
      <img src="@/assets/images/image-no-data.svg" alt="No Data" /><br /><br />
    </div>
    <div class="flex justify-center align-center mt-4">
      <span class="text-lg font-semibold text-stone-300">{{ message }}</span>
    </div>
    <!-- </div> -->
  </div>
</template>

<script setup lang="ts">
defineProps<{ message: string }>();
</script>

<style scoped></style>
