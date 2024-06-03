<template>
  <div>
    <AppTabs />
    <router-view />
  </div>
</template>

<script>
import AppTabs from '@/components/AppTabs.vue';
import router from './router/router';

export default {
  components: {
    AppTabs,
  },
  router: router
};
</script>
