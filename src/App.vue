<template>
  <div>
    <AppTabs />
    <router/>
  </div>
</template>

<script>
import AppTabs from '@/components/AppTabs.vue';
import router from './router';

export default {
  components: {
    AppTabs,
    router
  }
};
</script>
