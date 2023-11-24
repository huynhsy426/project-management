import { createRouter, createWebHistory } from 'vue-router';
const login = () => import('../views/login.vue');
const task = () => import('../views/task.vue');
const taskDetail = () => import('../views/taskDetail.vue');
const createTask = () => import('../views/addTask.vue')
const homePage = () => import('../views/homePage.vue');
const taskUpdate = () => import('../views/updateTask.vue')
const notFound = () => import('../views/notFound.vue')
const projectByAdmin = () => import('../views/admin/project.vue')
const taskByProject = () => import('../views/admin/task.vue')
const register = () => import('../views/register.vue')

const routes = [
    { path: '/', component: homePage, meta: { layout: 'vertical' } },
    { path: '/login', component: login, meta: { layout: 'full' } },
    { path: '/tasks', component: task, meta: { layout: 'vertical' } },
    { path: '/users/register', component: register, meta: { layout: 'full' } },
    { path: '/tasks/:id', component: taskDetail, meta: { layout: 'vertical' } },
    { path: '/tasks/create', component: createTask, meta: { layout: 'vertical' } },
    { path: '/tasks/:id/update', component: taskUpdate, meta: { layout: 'vertical' } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: notFound, meta: { layout: 'full' } },
    { path: '/admin/projects', component: projectByAdmin, meta: { layout: 'vertical' } },
    { path: '/admin/tasks/:projectId', component: taskByProject, meta: { layout: 'vertical' } },
]


const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})

router.resolve({
    name: 'not-found',
    params: { pathMatch: ['not', 'found'] },
}).href // '/not/found'

router.beforeResolve(async function (to) {
    // redirect to login page if not logged in and trying to access a restricted page
    const authorization = localStorage.getItem("token");

    if (!authorization && to.path !== "/login" && to.path !== "/users/register" && to.path !== '/:pathMatch(.*)*') {
        console.log("here authorization");
        return {
            path: "/login",
            query: { redirect: 'login' } // Optionally pass the intended redirect path
        };
    }


});


export default router;