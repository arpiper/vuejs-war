<template>
  <div class="player-hand">
    <h2>{{ name }}</h2>
    <card
      v-if="cards"
      class="deck"
      type="deck"
      cardBack="Deck">
    </card>
    <card 
      v-if="card"
      v-bind:value="card.value"
      v-bind:suit="card.suit"
      v-bind:faceUp="true"
      v-bind:owner="playerId"
      cardBack="card"
      :drawWinner="drawWinner">
    </card>
    <div v-if="drawThree">
      <card
        v-for="(c,i) in drawThree"
        v-bind:key="i"
        v-bind:value="c.value"
        v-bind:suit="c.suit"
        v-bind:faceUp="false"
        v-bind:warKey="i"
        v-bind:owner="playerId"
        cardBack="card">
      </card>
      <card
        v-if="warCard"
        v-for="(c,i) in warCard"
        v-bind:key="i"
        v-bind:value="c.value"
        v-bind:suit="c.suit"
        v-bind:owver="playerId"
        cardBack="card"
        v-bind:faceUp="true"
        class="war-card">
      </card>
    </div>
  </div>
</template>

<script>
import Card from "./Card.vue"
import { mapState } from "vuex"

export default {
  name: "hand",
  props: {
    cards: [Array, Object],
    name: String,
    playerId: String,
    drawWinner: [String, Object],
    //card: [Array, Object],
  },
  data () {
    return {
      //card: this.$store,
    }
  },
  computed: {
    ...mapState({
      card: function (state) {
        return state[this.playerId].card
      },
      drawThree: function (state) {
        return state[this.playerId].drawnCards
      },
      warCard: function (state) {
        return state[this.playerId].warCard
      },
    })
  },
  methods: {
    /*drawCard: function () {
      this.card = undefined
      let vm = this
      this.card = this.cards.pop()
      this.evtHub.$emit("draw", this.card, this.playerId)
    },*/
    checkHand: function () {
    },
    collect: function (winner) {
    }
  },
  components: {
    Card
  },
  created: function () {
    // this.evtHub.$on("drawBoth", this.drawCard)
    // this.evtHub.$on("war", this.war)
    // this.evtHub.$on("collect", this.collect)
  }
}
</script>

<style scoped>
.player-hand {
  display: flex;
  width: 60%;
  height: 40%;
  align-items: center;
}
.deck {
  margin: 10px;
  width: 75px;
  height: 100px;
  background-color: #dedede;
  border: 2px solid #bbb;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
div.war-card {
  transform: rotate(180deg);
}
.flipcard-enter, .flipcard-enter-active, .flipcard-leave, .flipcard-leave-active {
  transition: transform 1s;
}
</style>
