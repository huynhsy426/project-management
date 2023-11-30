import { createRouter, createWebHistory } from 'vue-router';
const Login = () => import('../views/Login.vue');
const Task = () => import('../views/Task.vue');
const TaskDetail = () => import('../views/TaskDetail.vue');
const CreateTask = () => import('../views/AddTask.vue')
const HomePage = () => import('../views/HomePage.vue');
const TaskUpdate = () => import('../views/UpdateTask.vue')
const NotFound = () => import('../views/NotFound.vue')
const ProjectByAdmin = () => import('../views/admin/Project.vue')
const TaskByProject = () => import('../views/admin/Task.vue')
const Register = () => import('../views/Register.vue')
const unauthorized = () => import('../views/UnauthorizedUser.vue')

const routes = [
    { path: '/', component: HomePage, meta: { layout: 'vertical' } },
    { path: '/login', component: Login, meta: { layout: 'full' } },
    { path: '/tasks', component: Task, meta: { layout: 'vertical' } },
    { path: '/users/register', component: Register, meta: { layout: 'vertical-Assign' } },
    { path: '/tasks/:id', component: TaskDetail, meta: { layout: 'vertical' }, props: true },
    { path: '/tasks/create', component: CreateTask, meta: { layout: 'vertical' } },
    { path: '/tasks/:id/update', component: TaskUpdate, meta: { layout: 'vertical' } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound, meta: { layout: 'full' } },
    { path: '/admin/projects', component: ProjectByAdmin, meta: { layout: 'vertical' } },
    { path: '/admin/tasks/:projectId', component: TaskByProject, meta: { layout: 'vertical' } },
    { path: '/unauthorized', component: unauthorized, meta: { layout: 'full' } },
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