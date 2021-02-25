import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    remainingShots: {},
    openOrders: []
  },
  mutations: {
    setRemainingShots(state, remainingShots) {
      state.remainingShots = remainingShots;
    },
    setOpenOrders(state, openOrders) {
      state.openOrders = openOrders;
    }
  },
  getters: {
    remainingShots(state) {
      return state.remainingShots;
    },
    openOrders(state) {
      return state.openOrders;
    }
  },
  actions: {
  },
  modules: {
  }
})
