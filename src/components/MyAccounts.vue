<template>
  <div class="mx-1">
    <v-toolbar class="mt-10" flat>
      <h2 v-if="!isMobile">Открытие счетов</h2>
      <h3 v-else>Открытие счетов</h3>
    </v-toolbar>
    <v-data-table :headers="headers" :items="meetingsList" :items-per-page="5" class="elevation-1">
      <template #[`item.stg`]="{ item }">
        <span>{{ item.stg.join(', ') }}</span>
      </template>
      <template #[`item.meeting_date`]="{ item }">
        <span>{{ formatDate(item.meeting_date) }}</span>
      </template>
      <template #[`item.meeting_state`]="{ item }">
        <span :class="statusClass(item.meeting_state)">{{ item.meeting_state }}</span>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';


export default {
  data() {
    return {
      isMobile: false
    };
  },
  computed: {
    ...mapState(['meetingsList']),
    headers() {
      return [
        { text: 'Город', value: 'client_city' },
        { text: 'Клиент', value: 'client_name' },
        { text: 'Банк', value: 'bank_name' },
        { text: 'Продукт', value: 'stg' },
        { text: 'Статус', value: 'meeting_state' },
        { text: 'Дата встречи', value: 'meeting_date' },
        { text: 'Место встречи', value: 'meeting_place' },
        { text: 'Телефон', value: 'person_phone' }
      ];
    }
  },
  methods: {
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
    updateIsMobile() {
      this.isMobile = window.innerWidth <= 600;
    }
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
  mounted() {
    this.$store.dispatch('fetchMeetingsList');
    this.updateIsMobile();
    window.addEventListener('resize', this.updateIsMobile);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateIsMobile);
  }
};
</script>

<style scoped>
h2 {
  margin-bottom: 20px;
  text-align: center;
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
</style>