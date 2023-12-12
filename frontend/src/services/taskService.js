import httpRequest from "@/utils/httpRequest";

export default {
    createTask: async (formData) => await httpRequest.post("/tasks/create", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    }),

    getTasks: async (taskInfo) => await httpRequest.get(`/tasks/list`, {
        params: {
            page: taskInfo.value.page,
            ITEMS_PER_PAGE: taskInfo.value.ITEMS_PER_PAGE,
            taskType: taskInfo.value.taskType,
        },
    }),

    getTaskById: async (taskId) => await httpRequest.get(`/tasks/${taskId}`),

    updateTask: async (form, taskId) => await httpRequest.put(`/tasks/${taskId}/update`, form, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    }),

    assignTask: async (taskId) => await httpRequest.put(`/tasks/assign/${taskId}`)
}