export const handleFinishBtn = async () => {
    try {
        const formDone = {
            status: "done",
            content: `Task done`,
        };
        await httpRequest.put(`/tasks/${taskId}/update`, formDone, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        errMessage.value = "";
        router.push({ path: `/tasks/${taskId}` }).then(() => {
            router.go();
        });
    } catch (error) {
        console.log(error);
        if (error?.status) {
            errMessage.value = error.data.messageCode;
        }
    }
};

export const assignTask = async () => {
    try {
        await httpRequest.put(`/tasks/assign/${taskId}`);

        errMessage.value = "";
        router.push({ path: "/tasks" }).then(() => {
            router.go();
        });
    } catch (error) {
        console.log(error);
        if (error?.status) {
            errMessage.value = error.data.messageCode;
        }
    }
};

export const formatDate = (date) => {
    const dateFormat = new Date(date);
    return `${dateFormat.getDate()}-${dateFormat.getMonth()}-${dateFormat.getFullYear()}`;
};

export const formatFileSize = function (bytes) {
    const sufixes = ["B", "kB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sufixes[i]}`;
};

export const formatFilePath = function (fileName) {
    return fileName.split(`uploads\\images\\`)[1];
};

export const updateTask = (taskId) => {
    router.push({ path: `/tasks/${taskId}/update` });
};