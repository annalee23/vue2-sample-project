<template>
    <div class="container">
      <h2>Список заявок</h2>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>№ Заявки</th>
              <th>Продукт</th>
              <th>Дата</th>
              <th>Клиент</th>
              <th>Статус</th>
              <th>Телефон</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in ordersList" :key="order.id" @click="openOrderDetails(order.id)">
              <td>{{ order.num }}</td>
              <td>{{ order.stg.join(', ') }}</td>
              <td>{{ formatDate(order.dadd) }}</td>
              <td>{{ order.client_name }}</td>
              <td :class="statusClass(order.state)">{{ order.state }}</td>
              <td>{{ order.person_phone }}</td>
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
      ...mapState(['ordersList'])
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
      openOrderDetails(orderId) {
        this.$store.dispatch('fetchOrderDetails', orderId)
          .then(order => {
            this.$root.$emit('open-order-tab', order);
          })
          .catch(error => {
            console.error('Ошибка при загрузке данных заявки:', error);
          });
      }
    },
    mounted() {
      this.$store.dispatch('fetchOrdersList');
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
    cursor: pointer; 
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
  
  tr:hover {
    background-color: #f5f5f5; /* Светло-серый */
  }
  </style>
  