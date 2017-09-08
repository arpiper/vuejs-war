import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'

Vue.use(Vuex)
/* eslint-disable no-new */
const evtHub = new Vue()
Vue.mixin({
  data: function () {
    return {
      evtHub: evtHub,
    }
  }
})

const store = new Vuex.Store({
  state: {
    p1: {
      hand: [],
      card: undefined,
      drawnCards: [],
      warCard: []
    },
    p2: {
      hand: [],
      card: undefined,
      drawnCards: [],
      warCard: []
    },
    pot: [],
  },
  getters: {
    p1Alive: state => state.p1.hand.length > 0,
    p1Size: state => state.p1.hand.length,
    p2Alive: state => state.p2.hand.length > 0,
    p2Size: state => state.p2.hand.length,
  },
  mutations: {
    deal (state, pl) {
      state[pl.player].hand = pl.cards
    },
    playCard (state, pl) {
      state[pl.player].card = state[pl.player].hand.pop()
    },
    drawCards (state, pl) {
      state[pl.player].drawnCards = state[pl.player].hand.splice(
        state[pl.player].hand.length - pl.number,
        pl.number
      )
    },
    clearCards (state) {
      state.p1.card = undefined
      state.p2.card = undefined
      if (state.p1.drawnCards) {
        state.p1.drawnCards = []
      }
      if (state.p2.drawnCards) {
        state.p2.drawnCards = []
      }
      if (state.p1.warCard) {
        state.p1.warCard = []
      }
      if (state.p2.warCard) {
        state.p2.warCard = []
      }
    },
    collectCards (state, pl) {
      state[pl.player].hand = state.pot.concat(state[pl.player].hand)
      state.pot = []
    },
    updatePot (state, pl) {
      state.pot = state.pot.concat(pl.cards)
    },
    warState (state, pl) {
      state.p1.warCard.push(state.p1.card)
      state.p1.card = undefined
      state.p2.warCard.push(state.p2.card)
      state.p2.card = undefined
    },
  },
  actions: {
    endRound ({ commit }) {
      commit('clearCards')
    }
  }
})

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
