<template >
  <navbar />
  <div
    class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4"
  >
    <router-view />
  </div>
</template>

<script setup>
import Navbar from "../../components/navbarAssignUp.vue";
</script>
