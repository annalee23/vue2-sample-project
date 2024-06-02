<template>
    <div class="mx-1">
      <v-data-table :headers="headers" :items="ordersList" class="elevation-1">
        <template v-slot:top>
          <v-toolbar flat>
            <h2>Список заявок</h2>
            <v-spacer></v-spacer>
            <v-btn class="my-4" color="primary" @click="openDialog()">Добавить заявку</v-btn>
          </v-toolbar>
        </template>
        <template #[`item.stg`]="{ item }">
          <span>{{ item.stg.join(', ') }}</span>
        </template>
        <template #[`item.dadd`]="{ item }">
          <span>{{ formatDate(item.dadd) }}</span>
        </template>
        <template #[`item.state`]="{ item }">
          <span :class="statusClass(item.state)">{{ item.state }}</span>
        </template>
      </v-data-table>
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title>
            {{ dialogTitle }}
          </v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-text-field v-model="editedItem.num" label="№ Заявки"></v-text-field>
              <v-text-field v-model="editedItem.stg" label="Продукт"></v-text-field>
              <v-text-field v-model="editedItem.client_name" label="Клиент"></v-text-field>
              <v-text-field v-model="editedItem.person_phone" label="Телефон"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDialog">Отмена</v-btn>
            <v-btn color="blue darken-1" text @click="saveItem">Сохранить</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script>
  import { mapMutations, mapState } from 'vuex';
  import moment from 'moment';
  
  export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
      dialogTitle: "Создать заявку",
      headers: [
        { text: '№ Заявки', value: 'num' },
        { text: 'Продукт', value: 'stg' },
        { text: 'Дата', value: 'dadd' },
        { text: 'Клиент', value: 'client_name' },
        { text: 'Статус', value: 'state' },
        { text: 'Телефон', value: 'person_phone' }
      ],
      editedIndex: -1,
      editedItem: {
        num: 0,
        stg: ["ACCOPEN"],
        dadd: "2021-06-24T14:28:14.237",
        client_name: "",
        state: "init",
        person_phone: ""
      },
      defaultItem: {
        num: 0,
        stg: [],
        dadd: "2021-06-24T14:28:14.237",
        client_name: " ",
        state: "init",
        person_phone: ""
      },
    }),
    computed: {
      ...mapState(['ordersList']),
    },
    methods: {
      ...mapMutations(['addNewItem']),
      formatDate(date) {
        return moment(date).format('DD.MM.YYYY HH:mm');
      },
      statusClass(status) {
        return {
          'status-init': status === 'init',
          'status-error': status === 'error',
          'status-upload_docs': status === 'upload_docs',
          'status-process': status === 'process',
          'status-reupload_fls': status === 'reupload_fls',
        };
      },
      openOrderDetails({ item }) {
        this.$store.dispatch('fetchOrderDetails', item.id)
          .then(() => {
            this.$root.$emit('open-order-tab', this.$store.state.currentOrder);
          })
          .catch(error => {
            console.error('Ошибка при загрузке данных заявки:', error);
          });
      },
  
      openDialog() {
        this.dialog = true;
      },
      closeDialog() {
        this.dialog = false;
        //this.$refs.form.reset();
      },
      saveItem() {
        if (this.$refs.form.validate()) {
          if (this.editedItem.id) {
            // Редактирование существующей заявки
            // Реализуйте логику редактирования заявки
          } else {
            // Создание новой заявки
            this.addNewItem(this.editedItem);
          }
          this.closeDialog();
        }
      },
    },
    mounted() {
      this.$store.dispatch('fetchOrdersList');
    }
  };
  </script>
  
  <style scoped>
  
  
  h2 {
    margin-bottom: 20px;
    text-align: center;
  }
  
  .v-data-footer {
    display: flex;
    justify-content: flex-end;
  }
  
  .v-data-footer__pagination,
  .v-data-footer__select {
    margin-left: auto;
  }
  
  .status-init {
    color: #ff6f00;
    /* Ярко-оранжевый */
    font-weight: bold;
    padding: 5px;
  }
  
  .status-error {
    color: #d32f2f;
    /* Ярко-красный */
    font-weight: bold;
    padding: 5px;
  }
  
  .status-upload_docs {
    color: #0288d1;
    /* Ярко-голубой */
    font-weight: bold;
    padding: 5px;
  }
  
  .status-process {
    color: #388e3c;
    /* Ярко-зеленый */
    font-weight: bold;
    padding: 5px;
  }
  
  .status-reupload_fls {
    color: #7b1fa2;
    /* Ярко-фиолетовый */
    font-weight: bold;
    padding: 5px;
  }
  
  tr:hover {
    background-color: #f5f5f5;
    /* Светло-серый */
  }
  </style>