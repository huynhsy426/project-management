import { createRouter, createWebHistory } from 'vue-router';
const login = () => import('../views/login.vue');
const task = () => import('../views/task.vue');
const taskDetail = () => import('../views/taskDetailPopup.vue');

const routes = [
    { path: '/login', component: login, meta: { layout: 'full' } },
    { path: '/task', component: task, meta: { layout: 'vertical' } },
    { path: '/task/:id', component: taskDetail, meta: { layout: 'vertical' } }
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})


router.beforeResolve(async function (to) {
    // redirect to login page if not logged in and trying to access a restricted page
    const authorization = localStorage.getItem("token");

    if (!authorization && to.path !== "/login") {
        console.log("here authorization");
        return {
            path: "/login",
            query: { redirect: 'login' } // Optionally pass the intended redirect path
        };
    }
});


export default router;