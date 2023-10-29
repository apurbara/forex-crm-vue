<template>
  <v-btn :icon="true" plain>
    <v-icon @click="logout">mdi-logout</v-icon>
  </v-btn>
</template>

<script>
export default {
  inject: ['userRepository'],
  methods: {
    async logout() {
      await this.$router.push('/home')
      this.userRepository.logout()
    }
  }
}
</script>

<style></style>
