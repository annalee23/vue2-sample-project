<template>
  <div class="mx-1">
    <v-data-table :headers="headers" :items="ordersList" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <h2>Список заявок</h2>
          <v-spacer></v-spacer>
          <v-btn class="my-4" color="primary" @click="openDialog()">Добавить заявку</v-btn>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Хотите удалить заявку?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Отмена</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">Да</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <template #[`item.stg`]="{ item }">
        <span>{{ Array.isArray(item.stg) ? item.stg.join(', ') : item.stg }}</span>
      </template>
      <template #[`item.dadd`]="{ item }">
        <span>{{ formatDate(item.dadd) }}</span>
      </template>
      <template #[`item.state`]="{ item }">
        <span :class="statusClass(item.state)">{{ item.state }}</span>
      </template>
      <template #[`item.num`]="{ item }">
        <div @click="selectOrder(item.id, item.num)" style="cursor: pointer;">
          {{ item.num }}
        </div>
      </template>

      <template #[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>{{ dialogTitle }}</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="editedItem.num" :rules="[rules.counter, rules.numIfNonEmpty]"
              label="№ Заявки" required></v-text-field>
            <v-text-field v-model="editedItem.stg" :rules="[rules.stgCheck, rules.max20Characters]" 
              label="Продукт" required></v-text-field>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                  offset-y min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="editedItem.dadd" label="Дата" prepend-icon="mdi-calendar" readonly
                      v-bind="attrs" v-on="on"></v-text-field>
                  </template>
                  <v-date-picker v-model="editedItem.dadd" @input="menu2 = false"></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-text-field v-model="editedItem.client_name" :rules="[rules.client_nameCheck]" 
               label="Клиент" required></v-text-field>
            <v-row>
              <v-col class="d-flex" cols="12" sm="6">
                <v-select v-model="editedItem.state" :items="statusOptions" label="Статус"></v-select>
              </v-col>
            </v-row>
            <v-text-field v-model="editedItem.person_phone" :rules="[rules.personPhoneCheck]" 
              label="Телефон" required></v-text-field>
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
    menu2: false,
    dialog: false,
    dialogDelete: false,
    dialogTitle: "Создать заявку",
    headers: [
      { text: '№ Заявки', value: 'num' },
      { text: 'Продукт', value: 'stg' },
      { text: 'Дата', value: 'dadd' },
      { text: 'Клиент', value: 'client_name' },
      { text: 'Статус', value: 'state' },
      { text: 'Телефон', value: 'person_phone' },
      { text: 'Действия', value: 'actions', sortable: false }
    ],
    statusOptions: [
      'init',
      'error',
      'upload_docs',
      'process',
      'reupload_fls'
    ],
    editedIndex: -1,
    editedItem: {
      num: 0,
      stg: [],
      dadd: moment().format('YYYY-MM-DD HH:mm'),
      client_name: "",
      state: "init",
      person_phone: ""
    },
    defaultItem: {
      num: 0,
      stg: [],
      dadd: moment().format('YYYY-MM-DD HH:mm'),
      client_name: "",
      state: "init",
      person_phone: ""
    },
    rules: {
    counter: value => value.length <= 8 || 'Максимум 8 символов',
    numIfNonEmpty: value => {
      const pattern = /^[0-9]+$/;
      return value === '' || pattern.test(value) || 'Недопустимый номер заявки. Используйте только цифры';
    },
    max20Characters: value => value.length <= 20 || 'Максимум 20 символов',
    stgCheck: value => {
      const pattern = /^[a-zA-Zа-яА-Я.'"0-9\s]+$/;
      return value === '' || pattern.test(value) || 'Используйте цифры (0-9) или буквы (a-z, A-Z, а-я, А-Я). Максимум 20 символов.';
    },
    client_nameCheck: value => {
      const pattern = /^[a-zA-Zа-яА-Я\s.'"0-9]+$/;
      return value === '' || (value.length <= 30 && pattern.test(value)) || 'Используйте цифры (0-9) или буквы (a-z, A-Z, а-я, А-Я). Максимум 30 символов.';
    },
    personPhoneCheck: value => {
      const pattern = /^[0-9]+$/;
      return value === '' || (value.length === 11 && pattern.test(value)) || 'Недопустимый номер телефона. Должен содержать ровно 11 цифр.';
    }
  },
  }),
  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },
  computed: {
    ...mapState(['ordersList']),
  },
  methods: {
    ...mapMutations(['addNewItem']),
    formatDate(date) {
      return moment(date).isValid() ? moment(date).format('DD.MM.YYYY HH:mm') : 'Invalid date';
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
    selectOrder(orderId, num) {
      this.$emit('select-order', {orderId, num});

    },
    openDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      //this.$refs.form.reset();
    },
    saveItem() {
      if (this.$refs.form.validate()) {
        if (!moment(this.editedItem.dadd).isValid()) {
          this.editedItem.dadd = moment().format('YYYY-MM-DD HH:mm');
        } else {
          this.editedItem.dadd = moment(this.editedItem.dadd).format('YYYY-MM-DD HH:mm');
        }
        if (this.editedItem.id > -1) {
          Object.assign(this.ordersList[this.editedIndex], this.editedItem);
        } else {
          this.addNewItem(this.editedItem);
        }
        this.closeDialog();
      }
    },
    editItem(item) {
      this.editedIndex = this.ordersList.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogTitle = "Редактировать заявку";
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.ordersList.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.ordersList.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      })
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