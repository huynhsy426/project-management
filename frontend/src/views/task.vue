<template>
  <div
    v-if="loading"
    role="status"
    class="flex justify-center align-middle w-full pb-5"
  >
    <svg
      aria-hidden="true"
      class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
    <span class="sr-only">Loading...</span>
  </div>
  <div v-if="errMessage">{{ errMessage }}</div>
  <div class="grid grid-cols-3 v gap-2 w-full">
    <div class="col-span-2 pr-3">
      <div
        class="w-98 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      >
        <div
          aria-current="true"
          class="block w-full px-4 py-2 text-white bg-blue-700 border-b border-gray-200 rounded-t-lg dark:bg-gray-800 dark:border-gray-600"
        >
          <div class="flex items-center space-x-4 rtl:space-x-reverse">
            <div class="flex-1 min-w-0">
              <p
                class="text-base font-medium text-white truncate dark:text-white"
              >
                TASK
              </p>
            </div>
            <div class="flex-1 min-w-0">
              <p
                class="text-base font-medium text-white truncate dark:text-white"
              >
                STATUS
              </p>
            </div>
            <div
              class="inline-flex items-center text-center text-base font-semibold text-white dark:text-white"
            >
              POINT
            </div>
          </div>
        </div>
        <ul class="divide-y divide-gray-200 dark:divide-gray-700">
          <!-- {{
            taskAssign.taskValue
          }} -->
          <li v-for="task in taskAssign.taskValue?.tasks" :key="task._id">
            <a
              class="block w-full px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
            >
              <div class="flex items-center space-x-6 rtl:space-x-reverse">
                <div class="flex-1 min-w-0">
                  <p
                    class="text-sm font-medium text-gray-900 truncate dark:text-white"
                    @click="handleItemTask"
                  >
                    {{ task.taskName }}
                  </p>
                  <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                    {{ task.content }}
                  </p>
                </div>
                <div class="flex-auto pl-0">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ task.status }}
                  </p>
                </div>
                <div
                  class="flex-none inline-flex items-center text-center text-base font-semibold text-gray-900 dark:text-white"
                >
                  {{ task.point }}
                </div>
              </div>
            </a>
          </li>
        </ul>
      </div>

      <div class="">
        <nav aria-label="Page navigation example ">
          <ul
            class="flex items-center -space-x-px h-8 text-sm justify-end mt-1"
          >
            <li>
              <a
                @click.prevent="
                  taskAssign.page !== 1 && handlePrevious($event, taskAssign)
                "
                :class="{
                  'hover:bg-gray-100 hover:text-gray-700 opacity-100 text-gray-500':
                    taskAssign.page !== 1,
                }"
                class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-300 bg-white border border-e-0 border-gray-300 rounded-s-lg opacity-5 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span class="sr-only">Previous</span>
                <svg
                  class="w-2.5 h-2.5 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 1 1 5l4 4"
                  />
                </svg>
              </a>
            </li>

            <li
              v-for="n in taskAssign?.taskValue?.pagination?.pageCount"
              :key="n"
            >
              <a
                class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                @click="pagination($event, n, taskAssign)"
                >{{ n }}</a
              >
            </li>

            <li>
              <a
                href="#"
                @click="handleNext($event, taskAssign)"
                :class="{
                  'hover:bg-gray-100 hover:text-gray-700 opacity-100 text-gray-500':
                    taskAssign.page !==
                    taskAssign?.taskValue?.pagination?.pageCount,
                }"
                class="flex items-center justify-center px-3 h-8 leading-tight text-gray-300 bg-white border border-gray-300 rounded-e-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span class="sr-only">Next</span>
                <svg
                  class="w-2.5 h-2.5 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    <div><taskReport /></div>
  </div>
  <div v-if="false" class="grid grid-cols-1 v w-full mt-3">
    <h1 class="flex justify-center text-center text-4xl mb-3">
      <b>PROJECT TASK</b>
    </h1>
    <div
      class="w-98 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    >
      <div
        aria-current="true"
        class="block w-full px-4 py-2 text-white bg-blue-700 border-b border-gray-200 rounded-t-lg dark:bg-gray-800 dark:border-gray-600"
      >
        <div class="flex items-center space-x-4 rtl:space-x-reverse">
          <div class="flex-1 min-w-0">
            <p
              class="text-base font-medium text-white truncate dark:text-white"
            >
              TASK
            </p>
          </div>
          <div
            class="inline-flex items-center text-center text-base font-semibold text-white dark:text-white"
          >
            POINT
          </div>
        </div>
      </div>
      <ul class="divide-y divide-gray-200 dark:divide-gray-700">
        <li v-for="task in taskNotAssign.taskValue?.tasks" :key="task._id">
          <a
            class="block w-full px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
          >
            <div class="flex items-center space-x-4 rtl:space-x-reverse">
              <div class="flex-1 min-w-0">
                <p
                  class="text-sm font-medium text-gray-900 truncate dark:text-white"
                >
                  {{ task.taskName }}
                </p>
                <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                  {{ task.content }}
                </p>
              </div>
              <div
                class="inline-flex items-center text-center text-base font-semibold text-gray-900 dark:text-white"
              >
                {{ task.point }}
              </div>
            </div>
          </a>
        </li>
      </ul>
    </div>

    <div class="" v-if="taskAssign.page === 1 ? false : true">
      <nav aria-label="Page navigation example">
        <ul class="flex items-center -space-x-px h-8 text-sm justify-end mt-1">
          <li>
            <a
              @click.prevent="
                taskNotAssign.page !== 1 &&
                  handlePrevious($event, taskNotAssign)
              "
              :class="{
                'hover:bg-gray-100 hover:text-gray-700 opacity-100 text-gray-500':
                  taskNotAssign.page !== 1,
              }"
              class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-300 bg-white border border-e-0 border-gray-300 rounded-s-lg opacity-5 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span class="sr-only">Previous</span>
              <svg
                class="w-2.5 h-2.5 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 1 1 5l4 4"
                />
              </svg>
            </a>
          </li>
          <li
            v-for="n in taskNotAssign?.taskValue?.pagination?.pageCount"
            :key="n"
          >
            <a
              href="#"
              class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >{{ n }}</a
            >
          </li>
          <li>
            <a
              href="#"
              @click="handleNext($event, taskNotAssign)"
              :class="{
                'hover:bg-gray-100 hover:text-gray-700 opacity-100 text-gray-500':
                  taskNotAssign.page !==
                  taskNotAssign?.taskValue?.pagination?.pageCount,
              }"
              class="flex items-center justify-center px-3 h-8 leading-tight text-gray-300 bg-white border border-gray-300 rounded-e-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span class="sr-only">Next</span>
              <svg
                class="w-2.5 h-2.5 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
  <taskDetail />
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import taskReport from "../components/taskReport.vue";
import taskDetail from "./taskDetailPopup.vue";
import { useRouter } from "vue-router";

const router = useRouter();

let isSelected = false;
let errMessage = ref("");
const loading = ref(true);

const taskAssign = ref({
  page: 1,
  ITEMS_PER_PAGE: 4,
  taskType: "a",
});
const taskNotAssign = ref({
  page: 1,
  ITEMS_PER_PAGE: 5,
  taskType: "na",
});

const handleItemTask = () => {
  console.log(router);
  router.push("/task/123");
};

onMounted(async () => {
  try {
    loading.value = true;
    const listTaskAssign = await axios.get("http://localhost:8082/tasks/list", {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token").split('"')[1]}`,
      },
      params: {
        page: taskAssign.value.page,
        ITEMS_PER_PAGE: taskAssign.value.ITEMS_PER_PAGE,
        taskType: taskAssign.value.taskType,
      },
    });

    const listTaskNotAssign = await axios.get(
      `http://localhost:8082/tasks/list?page=${taskAssign.value.page}&ITEMS_PER_PAGE=${taskNotAssign.value.ITEMS_PER_PAGE}&taskType=${taskNotAssign.value.taskType}`,
      {
        headers: {
          authorization: `Bearer ${
            localStorage.getItem("token").split('"')[1]
          }`,
        },
      }
    );
    loading.value = false;
    taskAssign.value.taskValue = {
      tasks: listTaskAssign.data.result.tasks,
      pagination: listTaskAssign.data.result.pagination,
    };
    taskNotAssign.value.taskValue = {
      tasks: listTaskNotAssign.data.result.tasks,
      pagination: listTaskNotAssign.data.result.pagination,
    };
    console.log({ taskAssign, taskNotAssign });
  } catch (error) {
    console.log({ error });
    if (error.response.status) {
      errMessage.value = error.response.data.messageCode;
    }
  }
});

const pagination = async (e, page, taskList) => {
  e.preventDefault();
  const listTask = await axios.get(
    `http://localhost:8082/tasks/list?page=${page}&ITEMS_PER_PAGE=${taskList.ITEMS_PER_PAGE}&taskType=${taskList.taskType}`,
    {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token").split('"')[1]}`,
      },
    }
  );

  taskList.page = page;
  taskList.taskValue = {
    tasks: listTask.data.result.tasks,
    pagination: listTask.data.result.pagination,
  };
};

const handlePrevious = (e, tasks) => {
  if (tasks.page === 1) {
    return tasks.page;
  }
  pagination(e, tasks.page - 1, tasks);
};

const handleNext = (e, tasks) => {
  if (tasks.page === tasks.taskValue.pagination.pageCount) {
    return tasks.page;
  }
  pagination(e, tasks.page + 1, tasks);
};
</script>

<style>
</style>