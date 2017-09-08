<template>
  <div id="app">
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
      <button @click="run()" :disabled="winner">Run</button>
      <button @click="clearCards()" >clear</button>
    </div>
    <div class="output">
      <!--span>{{ player1 }}</span-->
      <span>{{ p1Hand.length + p2Hand.length }}</span>
      <!--span>{{ player2 }}</span-->
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
    run: function () {
      let vm = this
      this.playCards()
      let w = this.compareCards()
      if (w === 0) {
        setTimeout(function () {
          vm.commenceWar()
        }, 500)
      } else {
        setTimeout(function () {
          vm.clearCards()
        }, 500)
      }
    },
    compareCards: function () {
      this.$store.commit("updatePot", {cards: [this.p1Card, this.p2Card]})
      if (this.p1Card.value > this.p2Card.value ) {
        this.$store.commit("collectCards", {player: "p1"})
        if (!this.p2Alive) {
          this.winner = "Player 1"
        } 
        this.drawWinner = "p1"
        return 1
      } else if (this.p1Card.value < this.p2Card.value) {
        this.$store.commit("collectCards", {player: "p2"})
        if (!this.p1Alive) {
          this.winner = "Player 2"
        } 
        this.drawWinner = "p2"
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
  justify-content: space-between;
  flex-wrap: wrap;
  flex-direction: column;
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
.main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: column;
  flex: 2;
}
.hand {
  flex: 1;
}
button {
  flex: 0;
  height: 50px;
  width: 100px;
}
.output {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}
.output span {
  flex: 1;
}
</style>
