<template>
  <div class="w-full pt-20">
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
          <h1 class="text-4xl text-">Register</h1>
        </div>
        <form class="space-y-4" @submit.prevent="register">
          <!-- Username -->
          <div>
            <label
              for="username"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Username</label
            >
            <input
              type="text"
              id="username"
              v-model="formRegister.username"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              placeholder="Nguyen van a"
              required
            />
          </div>

          <!-- email -->
          <div>
            <label
              for="email"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Your email</label
            >
            <input
              type="email"
              id="email"
              v-model="formRegister.email"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              placeholder="name@email.com"
              required
            />
          </div>

          <!-- password -->
          <div>
            <label
              for="password"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Your password</label
            >
            <input
              type="password"
              id="password"
              v-model="formRegister.userPassword"
              placeholder="••••••••"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              required
            />
          </div>

          <!-- age, exp -->
          <div class="grid gap-4 mb-4 grid-cols-2">
            <div class="col-span-2 sm:col-span-1">
              <label
                for="age"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Age</label
              >
              <input
                type="number"
                id="age"
                v-model="formRegister.age"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="$2999"
                required=""
              />
            </div>
            <div class="col-span-2 sm:col-span-1">
              <label
                for="exp"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Experience</label
              >
              <input
                type="number"
                id="exp"
                v-model="formRegister.exp"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="$2999"
                required=""
              />
            </div>
          </div>
          <button
            type="submit"
            class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Sign up
          </button>
        </form>
      </div>
      <div class="flex-1"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, computed } from "vue";
import httpRequest from "@/utils/httpRequest";
import { useRouter } from "vue-router";

const router = useRouter();

const formRegister = ref({
  username: "",
  userPassword: "",
  email: "",
  exp: 0,
  age: 0,
});
const error = ref();
const errMessage = ref("");

const validateName = (name) => {
  const regex = /^[a-zA-Z0-9_ ]{3,100}$/;
  const valid = regex.test(name);
  return valid;
};

const validateNumber = (age) => {
  const regex = /^(10|[0-9])$/;
  const valid = regex.test(age);
  return valid;
};

const validateEmail = (age) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const valid = regex.test(age);
  return valid;
};

const validatePassword = (password) => {
  const regex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{3,20}$/;
  const valid = regex.test(password);
  return valid;
};

const validateData = () => {
  delete error.value.taskName;
  delete error.value.content;
  delete error.value.point;
  delete error.value.deadlineAt;

  if (!validateName(this.formRegister.taskName)) {
    error.value.taskName = "Invalid task name";
  }
  if (!validateEmail(this.formRegister.email)) {
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

async function register() {
  try {
    await httpRequest.post("/users/register", formRegister.value);

    router.push({ path: "/login?signUp=true" });
  } catch (error) {
    console.log(error);
    if (error?.status) {
      errMessage.value = error.data.messageCode;
    }
  }
}
</script>

<style scoped>
</style>