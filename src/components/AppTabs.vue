<template>
  <v-card color="basil">
    <v-tabs
      v-model="activeTab"
      background-color="transparent"
      color="basil"
      grow
    >
      <v-tab v-for="tab in tabs" :key="tab.label">{{ tab.label }}</v-tab>
    </v-tabs>

    <v-tabs-items v-model="activeTab">
      <v-tab-item v-for="tab in tabs" :key="tab.label">
        <component :is="tab.component" :data="tab.data" />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import MyComponent1 from '@/components/MyComponent1.vue';
import MyComponent2 from '@/components/MyComponent2.vue';


export default {
  data() {
    return {
      activeTab: 0,
      tabs: [
        { label: 'Заявки', component: MyComponent1 },
        { label: 'Счета', component: MyComponent2 }
      ],
    };
  },
  methods: {
    
  }
};
</script>
