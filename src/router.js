import Vue from "vue";
import VueRouter from "vue-router";
import ApplicationsPage from '@/pages/ApplicationsPage.vue';
import AccountsPage from '@/pages/AccountsPage.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/application',
        component: ApplicationsPage,
    },
    {
        path: '/accounts',
        component: AccountsPage,
    }
]

export default new VueRouter({
    mode: 'history',
    routes
});
