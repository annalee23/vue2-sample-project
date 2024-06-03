<template>
  <v-app>
    <div class="mx-16">
      <v-tabs v-model="activeTab" background-color="transparent" color="basil" grow>
        <v-tab v-for="tab in tabs" :key="tab.label">{{ tab.label }}</v-tab>
      </v-tabs>

      <v-tabs-items v-model="activeTab">
        <v-tab-item v-for="tab in tabs" :key="tab.label">
          <component :is="tab.component" :data="tab.data" @select-order="navigateToOrder" />
        </v-tab-item>
      </v-tabs-items>
    </div>
  </v-app>
</template>

<script>
import MyApplications from '@/components/MyApplications.vue';
import MyAccounts from '@/components/MyAccounts.vue';
import OrderDetails from '@/components/OrderDetails.vue';


export default {
  data() {
    return {
      activeTab: 0,
      tabs: [
        { label: 'Заявки', component: MyApplications, path: '/application' },
        { label: 'Счета', component: MyAccounts, path: '/accounts' }
      ],
    };
  },
  methods: {
    navigateToOrder(orderId) {
      const existingTabIndex = this.tabs.findIndex(tab => tab.label.includes(orderId));
      if (existingTabIndex !== -1) {
        this.activeTab = existingTabIndex;
      } else {
        this.tabs.push({ label: 'Детали заявки ' + orderId, component: OrderDetails, path: '/order/' + orderId });
        this.activeTab = this.tabs.length - 1;
      }
    }
  },
  watch: {
    activeTab(newVal) {
      const selectedTab = this.tabs[newVal];
      if (selectedTab && selectedTab.path) {
        this.$router.push({ path: selectedTab.path });
      }
    }
  }
};
</script>


