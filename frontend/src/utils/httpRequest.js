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
        throw (error);
    },
);


httpRequest.interceptors.response.use(
    (response) => {
        if (response.data) return response.data;
    },
    (error) => {

        if (error.response) throw error.response;
    },
);

export default httpRequest;