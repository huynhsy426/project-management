<template>
  <default-layout />
</template>

<script setup>
import DefaultLayout from "./layouts/DefaultLayout.vue";
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  font-family: montserrat;
  background: linear-gradient(120deg, #2980b9, #8e44ad);
  height: 100vh;
  overflow: hidden;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
