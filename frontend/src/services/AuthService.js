import httpRequest from "@/utils/httpRequest";

export default {
    login: async (data) => await httpRequest.post('/users/login', data),
    getUser: async () => await httpRequest.get('/users/'),
    register: async (formData) => await httpRequest.post(
        "/users/register",
        formData
    ),
    getListUserInProject: async (projectId) => await httpRequest.get(`/projects/${projectId}/members`)
}