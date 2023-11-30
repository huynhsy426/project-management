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

  <div v-if="!loading" class="w-full">
    <div
      class="flex justify-center text-center text-2xl mb-5 text-red-500"
      style="font-weight: 600"
    >
      {{ errMessage }}
    </div>
    <div class="flex flex-auto">
      <div class="flex-1"></div>
      <div class="flex-1 border-2 border-gray-500 rounded-lg px-4 pb-6">
        <div class="mx-1 my-2 w-98 justify-center align-middle flex">
          <h1 class="text-4xl text-">Task</h1>
        </div>
        <form @submit.prevent="handleUpdateTask">
          <div class="taskName mt-2">
            <label
              for="website-admin"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Task name
            </label>
            <div class="flex">
              <input
                type="text"
                id="website-admin"
                class="rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="task name ...."
                v-model="taskInfo.taskName"
                :class="{ 'border-red-500': error.taskName }"
                required
              />
            </div>
            <span class="text-red-500 text-sm ml-2">{{ error.taskName }}</span>
          </div>

          <div class="taskContent mt-2">
            <label
              for="message"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >content</label
            >
            <textarea
              id="message"
              rows="2"
              v-model="taskInfo.content"
              class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="content..."
              required
              :class="{ 'border-red-500': error.content }"
            ></textarea>
            <span class="text-red-500 text-sm ml-2">{{ error.content }}</span>
          </div>

          <div class="point mt-2">
            <label
              for="steps-range"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Point: {{ rangePoint }}</label
            >

            <input
              @input="handleRangePoint"
              id="steps-range"
              type="range"
              min="0"
              max="10"
              v-model="taskInfo.point"
              step="1"
              :class="{ 'border-red-500': error.point }"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <span class="text-red-500 text-sm ml-2">{{ error.point }}</span>
          </div>

          <div class="attachments mt-4">
            <div class="flex items-center justify-center w-full">
              <label
                for="dropzone-file"
                class="flex flex-col py-3 w-full h-auto border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div
                  v-if="
                    attachmentsPayload.length === 0 &&
                    oldAttachments.length === 0
                  "
                  class="flex flex-col w-full h-full items-center justify-center pt-1 pb-1"
                >
                  <svg
                    class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span class="font-semi=bold">Click to upload</span> or drag
                    and drop
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    file .....
                  </p>
                </div>

                <div v-for="(attach, index) in oldAttachments" :key="index">
                  <div class="flex w-full h-full px-3 py-3 justify-between">
                    <div class="info-Attach flex flex-row space-x-1">
                      <div
                        class="icon"
                        v-if="
                          ['.JPG', '.JPEG', '.PNG', '.GIF'].includes(
                            attach.originalname
                          )
                        "
                      >
                        <font-awesome-icon icon="fa-regular fa-file-image" />
                      </div>
                      <div
                        class="icon"
                        v-else-if="
                          ['.MP3', '.WMA', '.WAV', '.FLAC'].includes(
                            attach.originalname
                          )
                        "
                      >
                        <font-awesome-icon icon="fa-regular fa-file-audio" />
                      </div>
                      <div
                        class="icon"
                        v-else-if="
                          ['.DOC', '.DOCM', '.DOCX', '.DOT', '.TXT'].includes(
                            attach.originalname
                          )
                        "
                      >
                        <font-awesome-icon icon="fa-regular fa-file" />
                      </div>
                      <div
                        class="icon"
                        v-else-if="
                          ['.AVI', '.FLV', '.WMV', '.MP4', '.MOV'].includes(
                            attach.originalname
                          )
                        "
                      >
                        <font-awesome-icon icon="fa-regular fa-file-video" />
                      </div>
                      <div class="icon" v-else>
                        <font-awesome-icon icon="fa-regular fa-file" />
                      </div>
                      <p>{{ attach.originalname }}</p>
                    </div>
                    <div
                      class="deleteTask"
                      @click.prevent="
                        handleDeleteAttachment(index, oldAttachments)
                      "
                    >
                      <font-awesome-icon
                        class="hover:scale-150"
                        icon="fa-solid fa-trash"
                      />
                    </div>
                  </div>
                </div>

                <div v-for="(attach, index) in attachmentsPayload" :key="index">
                  <div class="flex w-full h-full px-3 py-3 justify-between">
                    <div class="info-Attach flex flex-row space-x-1">
                      <div
                        class="icon"
                        v-if="attach.type.includes('application/')"
                      >
                        <font-awesome-icon icon="fa-regular fa-file" />
                      </div>
                      <div
                        class="icon"
                        v-else-if="attach.type.includes('audio/')"
                      >
                        <font-awesome-icon icon="fa-regular fa-file-audio" />
                      </div>
                      <div
                        class="icon"
                        v-else-if="attach.type.includes('image/')"
                      >
                        <font-awesome-icon icon="fa-regular fa-file-image" />
                      </div>
                      <div
                        class="icon"
                        v-else-if="attach.type.includes('video/')"
                      >
                        <font-awesome-icon icon="fa-regular fa-file-video" />
                      </div>
                      <div class="icon" v-else>
                        <font-awesome-icon icon="fa-regular fa-file" />
                      </div>
                      <p>{{ attach.name }}</p>
                    </div>
                    <div
                      class="deleteTask"
                      @click.prevent="
                        handleDeleteAttachment(index, attachmentsPayload)
                      "
                    >
                      <font-awesome-icon
                        class="hover:scale-150"
                        icon="fa-solid fa-trash"
                      />
                    </div>
                  </div>
                </div>

                <input
                  id="dropzone-file"
                  type="file"
                  class=""
                  multiple
                  @input="handleAttachment"
                  hidden
                />
              </label>
            </div>
          </div>

          <div class="mt-3 flex justify-center">
            <button
              @click="handleRejectTask"
              class="rounded-lg bg-yellow-400 px-3 py-2 text-white mr-2"
            >
              Reject
            </button>
            <button
              type="submit"
              class="rounded-lg bg-green-500 px-3 py-2 text-white"
            >
              Update
            </button>
          </div>
        </form>
      </div>
      <div class="flex-1"></div>
    </div>
  </div>
</template>

<script setup>
import httpRequest from "@/utils/httpRequest";
import { computed, onMounted, reactive, ref, watch, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

let loading = ref(true);
const taskId = route.params.id;
let errMessage = ref("");
const attachmentsPayload = ref([]);
const oldAttachments = ref([]);
const rangePoint = ref(0);
const error = ref({});

const taskInfo = reactive({});

onMounted(async () => {
  try {
    loading.value = true;
    const task = await httpRequest.get(`/tasks/${taskId}`);
    taskInfo.taskName = task.task.taskName;
    taskInfo.content = task.task.content;
    taskInfo.point = task.task.point;

    oldAttachments.value = task.task.attachments;
    rangePoint.value = taskInfo.point;

    errMessage.value = "";
    loading.value = false;
  } catch (error) {
    console.log(error);
    if (error?.status) {
      errMessage.value = error.data.messageCode;
    }
  }
});

const validateName = (name) => {
  const regex = /^[a-zA-Z0-9_ ]{3,100}$/;
  const valid = regex.test(name);
  return valid;
};

const validateContent = (name) => {
  const regex = /^[a-zA-Z0-9_ ]{3,100}$/;
  const valid = regex.test(name);
  return valid;
};

const validateNumber = (age) => {
  const regex = /^(10|[0-9])$/;
  const valid = regex.test(age);
  return valid;
};

const validateData = () => {
  delete error.value.taskName;
  delete error.value.content;
  delete error.value.point;
  delete error.value.deadlineAt;

  if (!validateName(taskInfo.taskName)) {
    error.value.taskName = "Invalid task name";
  }
  if (!validateContent(taskInfo.content)) {
    error.value.content = "Invalid content";
  }
  if (!validateNumber(taskInfo.point)) {
    error.value.point = "Invalid point";
  }

  let isValid = true;
  for (const key in error.value) {
    if (key) {
      isValid = false;
      break;
    }
  }
  return isValid;
};

const handleUpdateTask = async () => {
  try {
    const formData = new FormData();
    taskInfo.oldAttachments = JSON.stringify(oldAttachments.value);

    // Add task data to the FormData
    for (const key in taskInfo) {
      formData.append(key, taskInfo[key]);
    }

    // Add attachments to the FormData
    attachmentsPayload.value.forEach((attachment, index) => {
      formData.append(`file`, attachment);
    });

    errMessage.value = "";
    if (validateData()) {
      await httpRequest.put(`/tasks/${taskId}/update`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      router.push({ path: "/tasks" }).then(() => {
        router.go();
      });
    }
  } catch (error) {
    console.log(error);
    if (error?.status) {
      errMessage.value = error.data.messageCode;
    }
  }
};

const handleAttachment = (e) => {
  for (const key in e.target.files) {
    let element = e.target.files;
    if (!isNaN(key)) {
      attachmentsPayload.value.push(element[key]);
    }
  }
};

const handleRangePoint = (e) => {
  rangePoint.value = e.target.value;
};

const handleDeleteAttachment = (index, arr) => {
  arr.splice(index, 1);
};

const handleRejectTask = async () => {
  try {
    const formDone = {
      status: "rejected",
      content: `Task rejected`,
    };
    await httpRequest.put(`/tasks/${taskId}/update`, formDone, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    errMessage.value = "";
    router.push({ path: `/tasks/${taskId}` }).then(() => {
      router.go();
    });
  } catch (error) {
    console.log(error);
    if (error?.status) {
      errMessage.value = error.data.messageCode;
    }
  }
};
</script>

<style>
</style>