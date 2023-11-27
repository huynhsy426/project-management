<template>
  <nav class="bg-white border-gray-200 dark:bg-gray-900">
    <div
      class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4"
    >
      <div class="flex items-center space-x-3 rtl:space-x-reverse">
        <img
          src="https://flowbite.com/docs/images/logo.svg"
          class="h-8"
          alt="Flowbite Logo"
        />
        <span
          class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
          >Project</span
        >
      </div>
      <div class="hidden w-full md:block md:w-auto" id="navbar-default">
        <ul
          class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
        >
          <li v-if="user?.roles === 'Admin'">
            <a
              href="http://localhost:8080/admin/projects"
              class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >project</a
            >
          </li>
          <li>
            <a
              href="http://localhost:8080/tasks"
              class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >Task</a
            >
          </li>
          <li>
            <a
              href="http://localhost:8080/login"
              @click="logOut"
              class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >logout</a
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import "flowbite";

import { useRouter } from "vue-router";
import httpRequest from "@/utils/httpRequest";

import { onMounted, ref, reactive, computed } from "vue";

const user = ref();
const errMessage = ref("");

onMounted(async () => {
  try {
    const result = await httpRequest.get("/users");
    user.value = result.result;
  } catch (error) {
    console.error({ error });
  }
});

const logOut = (e) => {
  localStorage.clear();
};

const isAdmin = () => {};
</script>

<style>
</style>