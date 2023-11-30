import AuthService from '@/services/AuthService';
import { defineStore } from 'pinia';
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

export const useAuthStore = defineStore('auth', {
    state: () => {
        return {
            username: '',
            userPassword: '',
            errMessage: ''
        }
    },
    // could also be defined as
    // state: () => ({ count: 0 })
    actions: {
        async login() {
            try {
                const result = await AuthService.login({ username: this.username, userPassword: this.userPassword });
                window.localStorage.setItem("token", result.accessToken);

                this.errMessage = "";

                window.location.replace("http://localhost:8080/");
            } catch (error) {
                console.log(error);
                if (error?.status) {
                    this.errMessage = error.data.messageCode;
                }
            }
        },
    },
})