<template>
  <div class="mx-1">
    <v-data-table class="mt-10 elevation-1" :headers="headers" :items="ordersList">
      <template v-slot:top>
        <v-toolbar flat>
          <h2 v-if="!isMobile" class="mr-4">Список заявок</h2>
          <h3 v-else class="mr-4 my-10">Список заявок</h3>
          <v-spacer></v-spacer>
          <v-btn class="my-4" color="primary" @click="openDialog()">
            {{ isMobile ? '+' : 'Добавить заявку' }}
          </v-btn>
          <DialogDelete :dialog="dialogDelete" @close="closeDialog" @confirm="deleteItem" />
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
        <BtnEditDelete :item="item" @edit="editItem" @delete="openDialog(item, 'delete')" />
      </template>
    </v-data-table>

    <DialogEditCreate :dialog.sync="dialog" :editedItem="editedItem" :dialogTitle="dialogTitle" @save="saveItem"
      @close="closeDialog" />
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import moment from 'moment';
import DialogDelete from './DialogDelete.vue';
import BtnEditDelete from './BtnEditDelete.vue';
import DialogEditCreate from './DialogEditCreate.vue';

export default {
  components: {
    DialogDelete,
    BtnEditDelete,
    DialogEditCreate,
  },
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
    editedIndex: -1,
    editedItem: {
      id: 0,
      num: 0,
      stg: [],
      dadd: moment().format('YYYY-MM-DD HH:mm'),
      client_name: "",
      state: "init",
      person_phone: ""
    },
    defaultItem: {
      id: 6,
      num: 0,
      stg: [],
      dadd: moment().format('YYYY-MM-DD HH:mm'),
      client_name: "",
      state: "init",
      person_phone: ""
    },
    dialogMode: 'create', // 'create', 'edit', 'delete'
    nextId: 6,
    isMobile: false
  }),
  watch: {
    dialog(val) {
      if (!val) this.closeDialog();
    },
    dialogDelete(val) {
      if (!val) this.closeDialog();
    },
  },
  computed: {
    ...mapState(['ordersList']),
    isNewOrder() {
      return this.dialogMode === 'create';
    }
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
      this.$emit('select-order', { orderId, num });
    },

    openDialog(item = null, mode = 'create') {
      //console.log('Opening dialog:', { item, mode });
      this.dialogMode = mode;
      this.dialogTitle = mode === 'create' ? "Создать заявку" : "Редактировать заявку";

      if (mode === 'create') {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedItem.id = this.nextId++;
        this.editedIndex = -1;
      } else {
        this.editedIndex = this.ordersList.indexOf(item);
        this.editedItem = Object.assign({}, item);
      }

      if (mode === 'delete') {
        this.dialogDelete = true;
      } else {
        this.dialog = true;
      }
    },

    closeDialog() {
      this.dialog = false;
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.dialogMode = 'create';
      });
    },

    saveItem(localEditedItem) {
      if (this.editedIndex > -1) {
        Object.assign(this.ordersList[this.editedIndex], localEditedItem);
      } else {
        this.addNewItem(localEditedItem);
      }
      this.closeDialog();
    },

    editItem(item) {
      this.openDialog(item, 'edit');
    },

    deleteItem() {
      if (this.editedIndex > -1) {
        this.ordersList.splice(this.editedIndex, 1);
      }
      this.closeDialog();
    },
  },
  mounted() {
    this.$store.dispatch('fetchOrdersList');
    this.isMobile = window.innerWidth <= 600;
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 600;
    });
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
