<template>
  <div id="app">
    <div class="column">
      <div class="main">
        <deck class="deck"></deck>
        <hand 
          class="hand" 
          :cards="p1Hand"
          playerId="p1"
          :drawWinner="drawWinner"
          name="Player 1">
        </hand>
        <div v-if="winner" class="win">{{ winner }} wins!!</div>
        <hand 
          class="hand" 
          :cards="p2Hand"
          playerId="p2"
          :drawWinner="drawWinner"
          name="Player 2">
        </hand>
      </div>
      <div>
        <button @click="redeal()">New Game</button>
        <button @click="drawCards()" :disabled="winner">Draw</button>
        <button @click="clearCards()" >clear</button>
      </div>
    </div>
    <div class="winner-list">
      <span v-for="w in drawWinners" :class="w">
        {{ w }}
      </span>
    </div>
    <div class="output">
      <span class="p1">P1: {{ p1Hand.length }}</span>
      <span class="p2">P2: {{ p2Hand.length }}</span>
      <span>total: {{ p1Hand.length + p2Hand.length }}</span>
    </div>
  </div>
</template>

<script>
import Card from "./components/Card2.vue"
import Deck from "./components/Deck.vue"
import Hand from "./components/Hand2.vue"
import { mapState, mapGetters, mapMutations } from "vuex"

export default {
  name: 'app',
  data () {
    return {
      deck: [],
      winner: undefined,
      drawWinner: undefined,
      drawWinners: [],
    }
  },
  computed: {
    ...mapState({
      p1Hand: state => state.p1.hand,
      p1Card: state => state.p1.card,
      p1Drawn: state => state.p1.drawnCards,
      p2Hand: state => state.p2.hand,
      p2Card: state => state.p2.card,
      p2Drawn: state => state.p2.drawnCards,
      pot: state => state.pot
    }),
    ...mapGetters([
      "p1Alive",
      "p2Alive"
    ])
  },
  methods: {
    show: function (deck) {
      this.deck = deck
    },
    redeal: function () {
      this.winner = undefined
      this.player1 = []
      this.player2 = []
      this.deck = []
      this.evtHub.$emit("redeal")
    },
    compareCards: function () {
      this.$store.commit("updatePot", {cards: [this.p1Card, this.p2Card]})
      if (this.p1Card.value > this.p2Card.value ) {
        this.$store.commit("collectCards", {player: "p1"})
        if (!this.p2Alive) {
          this.winner = "Player 1"
        } 
        this.drawWinner = "p1"
        this.drawWinners.push("p1")
        return 1
      } else if (this.p1Card.value < this.p2Card.value) {
        this.$store.commit("collectCards", {player: "p2"})
        if (!this.p1Alive) {
          this.winner = "Player 2"
        } 
        this.drawWinner = "p2"
        this.drawWinners.push("p2")
        return 2
      } else {
        let vm = this
        setTimeout(function () {
          vm.$store.commit("warState")
          vm.commenceWar()
        }, 1000)
        //this.commenceWar()
      }
      return 0
    },
    commenceWar: function () {
      let n = 3
      if (this.$store.p1Size < 4) {
        let n = this.$store.p1Size - 1
      } else if (this.$store.p2Size < 4) {
        let n = this.$store.p2Size - 1
      }
      this.$store.commit("drawCards", {player: "p1", number: n})
      this.$store.commit("drawCards", {player: "p2", number: n})
      this.$store.commit("updatePot", {
        cards: this.p2Drawn.concat(this.p1Drawn)
      })
      let vm = this
      setTimeout(function () {
        // vm.drawCards()
      }, 500)
      this.playCards()
      // this.$store.commit("playCard", {player: "p1", faceUp: true})
      // this.$store.commit("playCard", {player: "p2", faceUp: true})
      // check 4card
      this.compareCards()
    },
    drawCards: function () {
      // collect cards
      if (this.p1Card && this.p2Card) {
        this.clearCards()
        let vm = this
        setTimeout(function() {
          vm.playCards()
          vm.compareCards()
        }, 500)
      } else {
        this.playCards()
        this.compareCards()
      }
    },
    playCards: function () {
      this.$store.commit("playCard", {player: "p1", faceUp: true})
      this.$store.commit("playCard", {player: "p2", faceUp: true})
    },
    ...mapMutations([
      "clearCards",
    ])
  },
  components: {
    Card,
    Deck,
    Hand
  },
  created: function () {
    this.evtHub.$on("shuffled", this.show)
  },
}
</script>

<style>
* {
  box-sizing: border-box;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 50px;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.column {
  display: flex;
  flex-direction: column;
  flex: 2;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.main {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: column;
  flex: 2;
}
.hand {
  flex: 1;
}
.output {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
}
.output span {
}
.winner-list {
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  padding: 5px;
}
.winner-list span {
  display: block;
}
.p1 {
  color: blue;
}
.p2 { 
  color: red;
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
button {
  flex: 0;
  height: 50px;
  width: 100px;
  background-color: #4caf50;
  border: 3px solid #4caf50;
}
@media (hover: hover) {
  button:hover {
    background-color: white;
    cursor: pointer;
  }
}
button:active {
  background-color: #4caf50;
  opacity: .5;
}
button:focus {
  outline: none;
}
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-thumb{
  background-color: #dcdcdc;
}
@media screen and (max-width: 480px) {

}
@media screen and (min-width: 480px) and (max-width: 720px) {
  #app {
    flex-direction: column;
    padding: 5px;
  }
  .winner-list {
    overflow-x: scroll;
    flex-direction: row;
  }
  .winner-list span {
    display: inline-block;
  }
}
</style>
