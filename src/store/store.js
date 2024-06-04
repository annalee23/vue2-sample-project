import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import moment from 'moment';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    ordersList: [],
    meetingsList: [],
    currentOrder: null
  },
  mutations: {
    setOrdersList(state, orders) {
      state.ordersList = orders.map(order => ({
        ...order,
        dadd: moment(order.dadd).isValid() ? moment(order.dadd).format('YYYY-MM-DD HH:mm') : 'Invalid date'
      }));
    },
    addNewItem(state, item) {
      console.log(item);
      state.ordersList.push(item);
    },
    setMeetingsList(state, meetings) {
      state.meetingsList = meetings;
    },
    setCurrentOrder(state, order) {
      state.currentOrder = order;
    }
  },
  actions: {
    fetchOrdersList({ commit }) {
      axios.get('https://my-json-server.typicode.com/plushevy/demo/list')
        .then(response => {
          commit('setOrdersList', response.data);
        })
        .catch(error => {
          console.error('Ошибка при загрузке списка заявок:', error);
          throw error; 
        });
    },
    fetchMeetingsList({ commit }) {
      axios.get('https://my-json-server.typicode.com/plushevy/demo/meetings')
        .then(response => {
          commit('setMeetingsList', response.data);
        })
        .catch(error => {
          console.error('Ошибка при загрузке списка встреч:', error);
          throw error; 
        });
    },
    fetchOrderDetails({ commit }, orderId) {
      axios.get(`https://my-json-server.typicode.com/plushevy/demo/orders/${orderId}`)
        .then(response => {
          commit('setCurrentOrder', response.data);
        })
        .catch(error => {
          console.error('Ошибка при загрузке данных заявки:', error);
          throw error; 
        });
    },
    
    
  }
});