<template>
    <div class="container">
      <h2>Открытие счетов</h2>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Город</th>
              <th>Клиент</th>
              <th>Банк</th>
              <th>Продукт</th>
              <th>Статус</th>
              <th>Дата встречи</th>
              <th>Место встречи</th>
              <th>Телефон</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="meeting in meetingsList" :key="meeting.id">
              <td>{{ meeting.client_city }}</td>
              <td>{{ meeting.client_name }}</td>
              <td>{{ meeting.bank_name }}</td>
              <td>{{ meeting.stg.join(', ') }}</td>
              <td :class="statusClass(meeting.meeting_state)">{{ meeting.meeting_state }}</td>
              <td>{{ formatDate(meeting.meeting_date) }}</td>
              <td>{{ meeting.meeting_place }}</td>
              <td>{{ meeting.person_phone }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import { mapState } from 'vuex';
  import moment from 'moment';

  
  export default {
    computed: {
      ...mapState(['meetingsList'])
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
    }
  },
  mounted() {
    this.$store.dispatch('fetchMeetingsList');
  }
  };
  </script>
  
  <style scoped>
  .container {
    padding: 20px;
  }
  
  h2 {
    margin-bottom: 20px;
    text-align: center;
  }
  
  .table-container {
    margin-top: 30px;
    overflow-x: auto; 
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed; 
  }
  
  th, td {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 12px;
    word-wrap: break-word;
  }
  
  th {
    background-color: #f2f2f2;
    position: sticky;
    top: 0; 
    background: #fff;
  }

  .status-init {
  background-color: #ffe0b2; /* Оранжевый */
}

.status-error {
  background-color: #ffccbc; /* Персиковый */
}

.status-upload_docs {
  background-color: #b2ebf2; /* Голубой */
}

.status-process {
  background-color: #c8e6c9; /* Зеленый */
}

.status-reupload_fls {
  background-color: #e1bee7; /* Фиолетовый */
}
  </style>
  