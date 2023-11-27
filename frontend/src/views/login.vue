<template>
  <span
    v-if="isSignUp"
    class="flex justify-center text-center w-full text-red-600 text-lg"
    style="font-weight: 500"
    >Register success</span
  >
  <div class="center">
    <h1>Login</h1>
    <span class="errMessage w-100">{{ errMessage }}</span>
    <form @submit.prevent="login">
      <div class="txt_field">
        <input
          type="text"
          id="UserName"
          v-model="formLogin.username"
          required
        />
        <label for="">Username</label>
      </div>

      <div class="txt_field">
        <input
          type="password"
          id="Password"
          v-model="formLogin.userPassword"
          required
        />
        <label for="">Password</label>
      </div>
      <div class="pass" style="margin-bottom: 5px">Forgot Password?</div>
      <button type="submit" class="button_submit">Login</button>
      <div class="signup_link">
        Not a member? <a @click="handleCreateUser">Signup</a>
      </div>
    </form>
  </div>
</template>

<script>
import httpRequest from "../utils/httpRequest";

async function login() {
  try {
    const result = await httpRequest.post("/users/login", this.formLogin);
    window.localStorage.setItem("token", result.accessToken);

    this.errMessage = "";

    this.$router.push({ path: "/" }).then(() => {
      this.$router.go();
    });
  } catch (error) {
    console.log(error);
    if (error?.status) {
      this.errMessage = error.data.messageCode;
    }
  }
}

async function handleCreateUser() {
  this.$router.push({ path: "/users/register" });
}

export default {
  data() {
    return {
      formLogin: {
        username: "",
        userPassword: "",
      },
      errMessage: "",
      isSignUp: this.$route.query.signUp ? this.$route.query.signUp : undefined,
    };
  },

  methods: {
    login,
    handleCreateUser,
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@500&family=Open+Sans:wght@300;400;600;700;800&display=swap");

body {
  margin: 0;
  padding: 0;
  font-family: montserrat;
  background: linear-gradient(120deg, #2980b9, #b561da);
  height: 100vh;
  overflow: hidden;
}

.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background: white;
  border-radius: 10px;
  font-family: montserrat;
  background: linear-gradient(120deg, #2980b9, #8e44ad);
}

.center h1 {
  text-align: center;
  padding: 10px 0 10px 0;
  font-size: larger;
  font-weight: 600;
  border-bottom: 1px solid silver;
  color: white;
}

.center form {
  padding: 0 40px;
  box-sizing: border-box;
}

form .txt_field {
  position: relative;
  border-bottom: 2px solid #adadad;
  margin: 30px 0;
}

.center .errMessage {
  display: flex;
  justify-content: center;
  /* text-align: center; */
  font-size: large;
  font-weight: 400;
  color: red;
}

.txt_field input {
  width: 100%;
  padding: 0 5px;
  height: 40px;
  font-size: 16px;
  border: none;
  background: none;
  outline: none;
}

.txt_field label {
  position: absolute;
  top: 50%;
  left: 5px;
  color: #adadad;
  transform: translateY(-50%);
  font-size: 16px;
  pointer-events: none;
  transition: 0.5s;
}

.txt_field span::before {
  content: "";
  position: absolute;
  top: 40px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #2691d9;
  transition: 0.5s;
}

.txt_field input:focus ~ label,
.txt_field input:valid ~ label {
  top: -5px;
  color: #2691d9;
}

.txt_field input:focus ~ span::before,
.txt_field input:valid ~ span::before {
  width: 100%;
}

.pass {
  margin: -5px- 20px 10px 0;
  color: #a6a6a6;
  cursor: pointer;
}

.pass:hover {
  text-decoration: underline;
}

.button_submit {
  width: 100%;
  height: 50px;
  border: 1px solid;
  background: #2691d9;
  border-radius: 25px;
  font-size: 18px;
  color: #e9f4fb;
  font-weight: 700;
  cursor: pointer;
  outline: none;
}

.button_submit:hover {
  border-color: #2691d9;
  transition: 0.5s;
}

.signup_link {
  margin: 30px 0;
  text-align: center;
  font-size: 16px;
  color: white;
}

.signup_link a {
  color: #2691d9;
  text-decoration: none;
}

.signup_link a:hover {
  text-decoration: underline;
}
</style>
