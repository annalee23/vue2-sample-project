import Vue from "vue";
import VueRouter from "vue-router";
import ApplicationsPage from '@/pages/ApplicationsPage.vue';
import AccountsPage from '@/pages/AccountsPage.vue';
import OrderDetails from '@/components/OrderDetails.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/application',
        component: ApplicationsPage,
    },
    {
        path: '/application/:id',
        name: 'OrderDetails',
        component: OrderDetails,
        props: true 
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