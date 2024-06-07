<template>
    <div>
      <v-icon small class="mr-2" @click="emitEdit">
        mdi-pencil
      </v-icon>
      <v-icon small @click="emitDelete">
        mdi-delete
      </v-icon>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      item: {
        type: Object,
        required: true,
      },
    },
    methods: {
      emitEdit() {
        this.$emit('edit', this.item);
      },
      emitDelete() {
        this.$emit('delete', this.item);
      },
    },
  };
  </script>
  
  <style scoped>
  .mr-2 {
    margin-right: 0.5rem;
  }
  </style>
  