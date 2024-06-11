import Vue from "vue";
import VueRouter from "vue-router";
import MyApplications from "@/components/MyApplications.vue";
import MyAccounts from "@/components/MyAccounts.vue";
import OrderDetails from '@/components/OrderDetails.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        redirect: '/application'
    },
    {
        path: '/application',
        component: MyApplications,
    },
    {
        path: '/application/:id',
        name: 'OrderDetails',
        component: OrderDetails,
        props: true 
    },
    {
        path: '/accounts',
        component: MyAccounts,
    }
    
]

export default new VueRouter({
    mode: 'history',
    routes
});