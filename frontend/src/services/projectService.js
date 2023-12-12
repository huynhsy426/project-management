import httpRequest from "@/utils/httpRequest";

export default {
    getProject: async () => await httpRequest.get("/projects/654b07d0060d663ea36e70a2"),
    getTasks: async (projectId, taskInfo) => await httpRequest.get(`/projects/${projectId}/tasks`,
        {
            params: {
                page: taskInfo.value.page,
                ITEMS_PER_PAGE: taskInfo.value.ITEMS_PER_PAGE,
                taskType: taskInfo.value.taskType,
            },
        }
    )
}