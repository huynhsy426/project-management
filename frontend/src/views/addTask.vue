<template>
  <div class="w-full">
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
        <form @submit.prevent="handleCreateTask">
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
                v-model="task.taskName"
                required
              />
            </div>
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
              v-model="task.content"
              class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="content..."
              required
            ></textarea>
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
              v-model="task.point"
              step="1"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <div class="deadlineAt mt-2">
            <label
              for="dealineAt"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Deadline</label
            >
            <input
              type="date"
              id="deadlineAt"
              :min="minDate"
              v-model="task.deadlineAt"
              class="rounded-lg appearance-none bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>

          <div class="attachments mt-4">
            <div class="flex items-center justify-center w-full">
              <label
                for="dropzone-file"
                class="flex flex-col py-3 w-full h-auto border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div
                  v-if="arrAttachment.length === 0"
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
                <div v-for="(attach, index) in arrAttachment" :key="index">
                  <div class="flex w-full h-full px-3 py-3 justify-between">
                    <div
                      class="info-Attach flex flex-row space-x-1"
                      v-if="attach.type.includes('application/')"
                    >
                      <div class="icon">
                        <font-awesome-icon icon="fa-regular fa-file" />
                      </div>
                      <p>{{ attach.name }}</p>
                    </div>
                    <div
                      class="info-Attach flex flex-row space-x-1"
                      v-else-if="attach.type.includes('audio/')"
                    >
                      <div class="icon">
                        <font-awesome-icon icon="fa-regular fa-file-audio" />
                      </div>
                      <p>{{ attach.name }}</p>
                    </div>
                    <div
                      class="info-Attach flex flex-row space-x-1"
                      v-else-if="attach.type.includes('image/')"
                    >
                      <div class="icon">
                        <font-awesome-icon icon="fa-regular fa-file-image" />
                      </div>
                      <p>{{ attach.name }}</p>
                    </div>
                    <div
                      class="info-Attach flex flex-row space-x-1"
                      v-else-if="attach.type.includes('video/')"
                    >
                      <div class="icon">
                        <font-awesome-icon icon="fa-regular fa-file-video" />
                      </div>
                      <p>{{ attach.name }}</p>
                    </div>
                    <div class="info-Attach flex flex-row space-x-1" v-else>
                      <div class="icon">
                        <font-awesome-icon icon="fa-regular fa-file" />
                      </div>
                      <p>{{ attach.name }}</p>
                    </div>
                    <div
                      class="deleteTask"
                      @click.prevent="handleDeleteAttachment(index)"
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
              type="submit"
              class="rounded-lg bg-green-500 px-3 py-2 text-white"
            >
              Save
            </button>
          </div>
        </form>
      </div>
      <div class="flex-1"></div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { computed, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const instance = axios.create({
  headers: {
    authorization: `Bearer ${localStorage.getItem("token").split('"')[1]}`,
    "Content-Type": "multipart/form-data",
  },
});

let minDate = ref(new Date().toISOString().split("T")[0]);
const arrAttachment = ref([]);
let errMessage = ref("");

const task = reactive({
  taskName: "",
  content: "",
  point: 0,
  deadlineAt: null,
  projectId: "654b07d0060d663ea36e70a2",
});

const rangePoint = ref(0);
const handleRangePoint = (e) => {
  rangePoint.value = e.target.value;
};

const handleAttachment = (e) => {
  for (const key in e.target.files) {
    let element = e.target.files;
    if (!isNaN(key)) {
      arrAttachment.value.push(element[key]);
    }
  }
  console.log(arrAttachment.value);
};

const handleDeleteAttachment = (index) => {
  arrAttachment.value.splice(index, 1);
};

const handleCreateTask = async () => {
  try {
    const formData = new FormData();

    // Add task data to the FormData
    for (const key in task) {
      formData.append(key, task[key]);
    }

    // Add attachments to the FormData
    arrAttachment.value.forEach((attachment, index) => {
      console.log({ attachment });
      formData.append(`file`, attachment);
    });

    await instance.post("http://localhost:8082/tasks/create", formData);
    router.push({ path: "/task" }).then(() => {
      router.go();
    });
  } catch (error) {
    console.log(error);
  }
};
</script>

<style>
</style>
