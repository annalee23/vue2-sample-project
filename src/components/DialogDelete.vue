<template>
  <v-dialog v-model="localDialog" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">Хотите удалить заявку?</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="onCancel">Отмена</v-btn>
        <v-btn color="blue darken-1" text @click="onConfirm">Да</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      localDialog: this.dialog
    };
  },
  watch: {
    dialog(val) {
      this.localDialog = val;
    },
    localDialog(val) {
      this.$emit('update:dialog', val);
    }
  },
  methods: {
    onCancel() {
      this.$emit('close');
    },
    onConfirm() {
      this.$emit('confirm');
    }
  }
};
</script>

<style scoped>
</style>
