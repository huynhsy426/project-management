import axios from 'axios';

const httpRequest = axios.create({
    baseURL: 'http://localhost:8082',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    },
    withCredentials: false,
});

httpRequest.interceptors.request.use(
    (config) => {
        config.headers.authorization = `Bearer ${localStorage.getItem("token")}`
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

const logout = () => {
    libAuth.clearToken()
    window.location.replace('/login')
}

httpRequest.interceptors.response.use(
    (response) => {
        if (response.data) return response.data;
    },
    (error) => {
        if (error?.response?.status === 401) {
            logout()
        }
        if (error.response) return error.response.data;
    },
);

export default httpRequest;