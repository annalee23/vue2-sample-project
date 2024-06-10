<template>
  <v-app>
    <div class="mx-16">
      <v-tabs v-model="activeTab" background-color="transparent" color="basil" grow>
        <v-tab v-for="tab in tabs" :key="tab.label">{{ tab.label }}</v-tab>
      </v-tabs>

      <v-tabs-items v-model="activeTab">
        <v-tab-item v-for="(tab, index) in tabs" :key="index">
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
    updateRoute(path) {
      this.$router.push(path);
    },
    navigateToOrder(item) {
      const existingTabIndex = this.tabs.findIndex(tab => tab.label.includes(item.num));
      if (existingTabIndex !== -1) {
        this.activeTab = existingTabIndex;
      } else {
        this.tabs.push({ label: 'Заявка ' + item.num, component: OrderDetails, path: '/application/' + item.orderId });
        this.activeTab = this.tabs.length - 1;
        this.$router.push({ path: this.tabs[this.activeTab].path });
      }
    },
    updateActiveTabBasedOnRoute() {
      const currentPath = this.$route.path;
      const tabIndex = this.tabs.findIndex(tab => currentPath === tab.path);
      if (tabIndex !== -1) {
        this.activeTab = tabIndex;
      } else {
        const match = currentPath.match(/^\/application\/(\d+)/);
        if (match) {
          const label = 'Заявка ';
          const existingOrderTabIndex = this.tabs.findIndex(tab => tab.label === label);
          if (existingOrderTabIndex === -1) {
            this.tabs.push({ label: label, component: OrderDetails, path: currentPath });
            this.activeTab = this.tabs.length - 1;
          } else {
            this.activeTab = existingOrderTabIndex;
          }
        }
      }
    }
  },
  watch: {
    activeTab(newVal) {
      const selectedTab = this.tabs[newVal];
      if (selectedTab && selectedTab.path && this.$route.path !== selectedTab.path) {
        this.$router.push({ path: selectedTab.path });
      }
    }
  },
  created() {
    this.updateActiveTabBasedOnRoute();
  },
  beforeRouteUpdate(to, from, next) {
    this.updateActiveTabBasedOnRoute();
    next();
  }
};
</script>