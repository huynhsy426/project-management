import httpRequest from "@/utils/httpRequest";

export default {
    login: async (data) => await httpRequest.post('/users/login', data)
}