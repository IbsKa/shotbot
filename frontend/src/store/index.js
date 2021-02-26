import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    remainingShots: {},
    openOrders: [],
    connectionState: "not connected",
    currentJob: ""
  },
  mutations: {
    setRemainingShots(state, remainingShots) {
      state.remainingShots = remainingShots;
    },
    setOpenOrders(state, openOrders) {
      state.openOrders = openOrders;
    },
    setConnectionState(state, connectionState) {
      state.connectionState = connectionState;
    },
    setCurrentJob(state, job) {
      state.currentJob = job;
    }
  },
  getters: {
    remainingShots(state) {
      return state.remainingShots;
    },
    openOrders(state) {
      return state.openOrders;
    },
    connectionState(state) {
      return state.connectionState;
    },
    currentJob(state) {
      return state.currentJob;
    }
  },
  actions: {
  },
  modules: {
  }
})
