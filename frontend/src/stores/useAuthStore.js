import authService from '@/services/authService';
import { defineStore } from 'pinia';
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

export const useAuthStore = defineStore('auth', {
    state: () => {
        return {
            username: '',
            userPassword: '',
            errMessage: '',
            user: null
        }
    },
    // could also be defined as
    // state: () => ({ count: 0 })
    actions: {
        async login() {
            try {
                const result = await authService.login(
                    {
                        username: this.username,
                        userPassword: this.userPassword
                    }
                );
                window.localStorage.setItem("token", result.accessToken);

                const user = await authService.getUser();
                this.user = user.result;

                console.log(this.user)
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