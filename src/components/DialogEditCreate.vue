<template>
  <v-dialog v-model="internalDialog" max-width="600px">
    <v-card>
      <v-card-title>{{ dialogTitle }}</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field v-model="localEditedItem.num" :rules="[rules.counter, rules.numIfNonEmpty]" label="№ Заявки"
            required></v-text-field>
          <v-text-field v-model="localEditedItem.stg" :rules="[rules.stgCheck, rules.max20Characters]" label="Продукт"
            required></v-text-field>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="localEditedItem.dadd" label="Дата" prepend-icon="mdi-calendar" readonly
                    v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="localEditedItem.dadd" @input="menu2 = false"></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-text-field v-model="localEditedItem.client_name" :rules="[rules.client_nameCheck]" label="Клиент"
            required></v-text-field>
          <v-row>
            <v-col class="d-flex" cols="12" sm="6">
              <v-select v-model="localEditedItem.state" :items="statusOptions" label="Статус"></v-select>
            </v-col>
          </v-row>
          <v-text-field v-model="localEditedItem.person_phone" :rules="[rules.personPhoneCheck]" label="Телефон"
            required></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeDialog">Отмена</v-btn>
        <v-btn color="blue darken-1" text @click="saveLocalItem">Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from 'moment';

export default {
  props: {
    dialog: {
      type: Boolean,
      required: true
    },
    editedItem: {
      type: Object,
      required: true
    },
    dialogTitle: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      menu2: false,
      internalDialog: this.dialog,
      localEditedItem: Object.assign({}, this.editedItem),
      statusOptions: [
        'init',
        'error',
        'upload_docs',
        'process',
        'reupload_fls'
      ],
      rules: {
        counter: value => String(value).length <= 8 || 'Максимум 8 символов',
        numIfNonEmpty: value => {
          const pattern = /^[0-9]+$/;
          return value === '' || pattern.test(value) || 'Недопустимый номер заявки. Используйте только цифры';
        },
        max20Characters: value => String(value).length <= 20 || 'Максимум 20 символов',
        stgCheck: value => {
          value = String(value);
          const pattern = /^[a-zA-Zа-яА-Я.'"0-9\s]+$/;
          return value === '' || pattern.test(value) || 'Используйте цифры (0-9) или буквы (a-z, A-Z, а-я, А-Я).';
        },
        client_nameCheck: value => {
          const pattern = /^[a-zA-Zа-яА-Я\s.'"0-9]+$/;
          return value === '' || (value.length <= 30 && pattern.test(value)) || 'Используйте цифры (0-9) или буквы (a-z, A-Z, а-я, А-Я). Максимум 30 символов.';
        },
        personPhoneCheck: value => {
          const pattern = /^[0-9]+$/;
          return value === '' || (value.length === 11 && pattern.test(value)) || 'Недопустимый номер телефона. Должен содержать ровно 11 цифр.';
        }
      }
    };
  },
  watch: {
    dialog(val) {
      this.internalDialog = val;
    },
    internalDialog(val) {
      this.$emit('update:dialog', val);
    },
    editedItem(val) {
      this.localEditedItem = Object.assign({}, val);
    }
  },
  methods: {
    saveLocalItem() {
      if (this.$refs.form.validate()) {
        if (!moment(this.localEditedItem.dadd).isValid()) {
          this.localEditedItem.dadd = moment().format('YYYY-MM-DD HH:mm');
        } else {
          this.localEditedItem.dadd = moment(this.localEditedItem.dadd).format('YYYY-MM-DD HH:mm');
        }
        this.$emit('save', this.localEditedItem);
        this.closeDialog();
      }
    },
    closeDialog() {
      this.internalDialog = false;
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.mr-2 {
  margin-right: 0.5rem;
}
</style>
