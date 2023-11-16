<template>
  <ul
    class="w-98 h-98 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
  >
    <li
      class="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600"
    >
      <div
        class="flex items-center justify-center space-x-4 rtl:space-x-reverse"
      >
        <p
          class="text-base text-center font-medium text-gray-900 truncate dark:text-white"
        >
          TASK REVIEW
        </p>
      </div>
    </li>
    <li
      class="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600"
    >
      <div class="flex items-center space-x-4 rtl:space-x-reverse">
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
            Done
          </p>
        </div>
        <div
          class="inline-flex items-center text-center text-base font-semibold text-gray-900 dark:text-white"
        >
          {{ reportUser.numDone }}
        </div>
      </div>
    </li>
    <li
      class="w-full px-4 py-3 border-b border-gray-200 rounded-t-lg dark:border-gray-600"
    >
      <div class="flex items-center space-x-4 rtl:space-x-reverse">
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
            Pending
          </p>
        </div>
        <div
          class="inline-flex items-center text-center text-base font-semibold text-gray-900 dark:text-white"
        >
          {{ reportUser.numPending }}
        </div>
      </div>
    </li>
    <li
      class="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600"
    >
      <div class="flex items-center space-x-4 rtl:space-x-reverse">
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
            Rejected
          </p>
        </div>
        <div
          class="inline-flex items-center text-center text-base font-semibold text-gray-900 dark:text-white"
        >
          {{ reportUser.numRejected }}
        </div>
      </div>
    </li>
    <li
      class="w-full px-4 py-3 border-b border-gray-200 rounded-t-lg dark:border-gray-600"
    >
      <div class="flex items-center space-x-4 rtl:space-x-reverse">
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
            Average time
          </p>
        </div>
        <div
          class="inline-flex items-center text-center text-base font-semibold text-gray-900 dark:text-white"
        >
          {{ (reportUser.averageTime || 0).toFixed(2) }}
        </div>
      </div>
    </li>
    <li
      class="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600"
    >
      <div class="flex items-center space-x-4 rtl:space-x-reverse">
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
            Longest time
          </p>
        </div>
        <div
          class="inline-flex items-center text-center text-base font-semibold text-gray-900 dark:text-white"
        >
          {{ (reportUser.timeLongest || 0).toFixed(2) }}
        </div>
      </div>
    </li>
    <li
      class="w-full px-4 py-3 border-b border-gray-200 rounded-t-lg dark:border-gray-600"
    >
      <div class="flex items-center space-x-4 rtl:space-x-reverse">
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
            Shortest time
          </p>
        </div>
        <div
          class="inline-flex items-center text-center text-base font-semibold text-gray-900 dark:text-white"
        >
          {{ (reportUser.timeShortest || 0).toFixed(2) }}
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
const reportUser = ref({});

onMounted(async () => {
  try {
    console.log("here 1");
    const result = await axios.get("http://localhost:8082/reports/user", {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token").split('"')[1]}`,
      },
    });
    console.log({ aa: result });
    reportUser.value = result.data;
    console.log(reportUser.value.numDone);
  } catch (error) {
    console.log({ error });
    if (error.response.status) {
      errMessage.value = error.response.data.messageCode;
    }
  }
});
</script>

<style>
</style>