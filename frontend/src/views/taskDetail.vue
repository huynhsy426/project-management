<template>
  <!-- reload  -->
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

  <div v-if="!loading" class="w-full">
    <div
      v-if="props.errMessage"
      class="text-center w-full text-2xl text-red-500 pb-3"
      style="font-weight: 500"
    >
      {{ props.errMessage }}
    </div>

    <div class="flex justify-center w-full">
      <div
        class="info border-2 border-gray-500 rounded-lg px-4 py-6"
        style="width: 700px"
      >
        <div class="taskName flex justify-between">
          <p class="taskName text-3xl" style="font-weight: 600">
            {{ taskInfo.task?.taskName }}
          </p>
          <div v-if="taskInfo.task?.assignee" class="flex flex-row">
            <p class="text-base" style="font-weight: 600">Assignee:&nbsp;</p>
            <p>{{ taskInfo.task?.assignee?.username }}</p>
          </div>
        </div>
        <div class="status mt-2">
          <div
            v-if="taskInfo.task?.status === 'done'"
            class="border-2 border-green-400 bg-green-400 text-white rounded-lg px-1 py-1 text-center w-16"
          >
            {{ taskInfo.task?.status }}
          </div>
          <div
            v-if="taskInfo.task?.status === 'doing'"
            class="border-2 border-blue-400 bg-blue-400 rounded-lg px-1 py-1 text-center w-16"
          >
            {{ taskInfo.task?.status }}
          </div>
          <div
            v-if="taskInfo.task?.status === 'rejected'"
            class="border-2 border-red-600 bg-red-600 text-white rounded-lg px-1 py-1 text-center w-20"
          >
            {{ taskInfo.task?.status }}
          </div>
        </div>
        <div class="content text-lg mt-2" style="font-weight: 500">
          <p>{{ taskInfo.task?.content }}</p>
        </div>
        <div class="point">
          <div class="text-lg mt-2" style="font-weight: 500">
            POINT:
            <span
              class="font-medium text-gray-600 dark:text-gray-400 text-base"
              style="font-weight: 500"
              >{{ taskInfo.task?.point }}</span
            >
          </div>
          <div class="flex items-center">
            <div class="w-2/4 h-5 mr-3 bg-gray-200 rounded dark:bg-gray-700">
              <div
                class="h-5 rounded"
                :style="{ width: `${pointPercent}%` }"
                :class="bgColor"
              ></div>
            </div>
          </div>
        </div>
        <div class="timeContent mt-2 grid grid-cols-2">
          <div class="createAt">
            <p class="text-xl" style="font-weight: 600">Create at:</p>
            <p class="text-base" style="font-weight: 500">
              {{ timeContent.createdAt }}
            </p>
          </div>
          <div class="deadlineAt">
            <p class="text-xl" style="font-weight: 600">Deadline at:</p>
            <p class="text-base text-red-500" style="font-weight: 500">
              {{ timeContent.deadlineAt }}
            </p>
          </div>
        </div>
        <div class="attachment mt-2">
          <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table
              class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
            >
              <thead
                class="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400"
              >
                <tr>
                  <th scope="col" class="px-6 py-3">File</th>
                  <th scope="col" class="px-6 py-3">Name</th>
                  <th scope="col" class="px-6 py-3">size</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                  v-for="(attach, index) in taskInfo.task?.attachments"
                  :key="index + attach.originalname"
                >
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <a
                      :href="`http://localhost:8082/${attach.path}`"
                      target="_blank"
                    >
                      {{ formatFilePath(attach.path) }}
                    </a>
                  </th>
                  <td class="px-6 py-4">{{ attach.originalname }}</td>
                  <td class="px-6 py-4">
                    {{ !attach.size ? "none" : formatFileSize(+attach.size) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div
          class="grid grid-cols-4 mt-3"
          v-if="taskInfo.task?.status === 'doing'"
        >
          <div></div>
          <div></div>
          <div></div>
          <div
            v-if="taskInfo.task?.assignee"
            class="flex justify-center align-middle"
          >
            <button
              @click="handleFinishBtn"
              class="px-3 mr-3 rounded-md py-2 bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2"
            >
              Finish
            </button>
            <button
              @click="updateTask(taskInfo.task._id)"
              class="px-3 rounded-md py-2 bg-blue-500 text-white"
            >
              Update
            </button>
          </div>
          <div v-else class="flex justify-center align-middle">
            <button
              class="px-3 rounded-md py-2 bg-green-500 text-white"
              @click="assignTask"
            >
              Assign
            </button>
          </div>
        </div>
      </div>

      <!-- Conmment -->
      <div
        class="comment border-2 border-gray-500 rounded-md px-4 py-6"
        style="width: 500px"
      >
        <commentsCompoment />
      </div>
    </div>
  </div>
</template>

<script setup>
import commentsCompoment from "../components/CommentTask.vue";
import httpRequest from "@/utils/httpRequest";
import { onMounted, ref, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

// const test = query
let loading = ref(true);

const taskId = route.params.id;
let props = defineProps(["errMessage"]);
const taskInfo = reactive({});

const timeContent = reactive({
  createdAt: null,
  deadlineAt: null,
});

const pointPercent = computed(() => {
  return (taskInfo.task?.point * 1000) / 100;
});

const bgColor = computed(() => {
  if (pointPercent.value <= 30) {
    return "bg-green-400";
  }
  if (pointPercent.value > 30 && pointPercent.value <= 60) {
    return "bg-yellow-400";
  }
  if (pointPercent.value > 60 && pointPercent.value <= 80) {
    return "bg-red-400";
  }
  if (pointPercent.value > 80 && pointPercent.value <= 100) {
    return "bg-red-600";
  }
});

onMounted(async () => {
  try {
    loading.value = true;
    const task = await httpRequest.get(`/tasks/${taskId}`);
    console.log(task);
    loading.value = false;
    taskInfo.task = task.task;
    timeContent.createdAt = formatDate(taskInfo.task.createdAt);
    timeContent.deadlineAt = formatDate(taskInfo.task.deadlineAt);
  } catch (error) {
    console.log(error);
    if (error?.status) {
      props.errMessage = error.data.messageCode;
    }
  }
});

const handleFinishBtn = async () => {
  try {
    const formDone = {
      status: "done",
      content: `Task done`,
    };
    await httpRequest.put(`/tasks/${taskId}/update`, formDone, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    props.errMessage = "";
    router.push({ path: `/tasks/${taskId}` }).then(() => {
      router.go();
    });
  } catch (error) {
    console.log(error);
    if (error?.status) {
      props.errMessage = error.data.messageCode;
    }
  }
};

const assignTask = async () => {
  try {
    await httpRequest.put(`/tasks/assign/${taskId}`);

    props.errMessage = "";
    router.push({ path: "/tasks" }).then(() => {
      router.go();
    });
  } catch (error) {
    console.log(error);
    if (error?.status) {
      props.errMessage = error.data.messageCode;
    }
  }
};

const formatDate = (date) => {
  const dateFormat = new Date(date);
  return `${dateFormat.getDate()}-${dateFormat.getMonth()}-${dateFormat.getFullYear()}`;
};

const formatFileSize = function (bytes) {
  const sufixes = ["B", "kB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sufixes[i]}`;
};

const formatFilePath = function (fileName) {
  const filExtension = handleFilExtension(fileName).toUpperCase();

  if ([".JPG", ".JPEG", ".PNG", ".GIF"].includes(filExtension)) {
    return fileName.split(`uploads\\images\\`)[1];
  }
  if ([".MP3", ".WMA", ".WAV", ".FLAC"].includes(filExtension)) {
    return fileName.split(`uploads\\audio\\`)[1];
  }
  // word, pdf, excel
  if ([".DOC", ".DOCM", ".DOCX", ".DOT", ".TXT"].includes(filExtension)) {
    return fileName.split(`uploads\\files\\`)[1];
  }
  if ([".XLSM", ".XLSX", ".XLT"].includes(filExtension)) {
    return fileName.split(`uploads\\files\\`)[1];
  }
};

const handleFilExtension = (string) => {
  const parts = string.split(".");

  const fileExtension = parts[parts.length - 1];

  return `.${fileExtension}`;
};

const updateTask = (taskId) => {
  router.push({ path: `/tasks/${taskId}/update` });
};
</script>


<style scoped>
.material-design-icon {
  display: inline-flex;
  align-self: center;
  position: relative;
  height: 1em;
  width: 1em;
}
.material-design-icon svg {
  height: 1em;
  width: 1em;
  fill: currentColor;
  position: absolute;
  bottom: -0.125em;
}
</style>