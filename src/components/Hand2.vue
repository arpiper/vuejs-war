<template>
  <div class="player-hand">
    <h2 :class="playerId">{{ name }}</h2>
    <card
      v-if="cards"
      class="deck"
      back="Deck">
    </card>
    <transition name="play-card"
      @before-enter="playCardBeforeEnter"
      @after-enter="playCardAfterEnter">
      <card 
        v-if="card"
        v-bind:value="card.value"
        v-bind:suit="card.suit"
        v-bind:faceUp="true"
        back="card">
      </card>
    </transition>
    <div v-if="drawThree">
      <transition-group name="draw-three"
        @after-enter="drawThreeAfterEnter">
        <card
          v-for="(c,i) in drawThree"
          v-bind:key="i"
          v-bind:value="c.value"
          v-bind:suit="c.suit"
          v-bind:faceUp="false"
          v-bind:data-index="i"
          v-bind:owner="playerId"
          cardBack="card">
        </card>
      </transition-group>
      <transition-group name="war-card"
        @before-enter="warCardBeforeEnter"
        @after-enter="warCardAfterEnter">
        <card
          v-if="warCard"
          v-for="(c,i) in warCard"
          v-bind:key="i"
          v-bind:value="c.value"
          v-bind:suit="c.suit"
          v-bind:owner="playerId"
          cardBack="card"
          v-bind:faceUp="true"
          class="war-card">
        </card>
      </transition-group>
    </div>
  </div>
</template>

<script>
import Card from "./Card2.vue"
import { mapState } from "vuex"

export default {
  name: "hand",
  props: {
    cards: [Array, Object],
    name: String,
    playerId: String,
    drawWinner: [String, Object],
  },
  data () {
    return {
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
    playCardBeforeEnter: function (el) {
      let x = "-85px"
      let y = 0
      el.style.transform = `translate(${x}, ${y}) rotateY(0)`
    },
    playCardAfterEnter: function(el) {
      let x = 0
      let y = "100px"
      if (this.playerId === "p2") {
        y = "-100px"
      }
      let d = 0
      if (this.warCard.length) {
        d = 1000
      }
      setTimeout(function () {
        el.style.transform = `translate(${x}, ${y}) rotateY(180deg)`
      }, d)
    },
    drawThreeBeforeEnter: function (el) {
      let y = 0
      let x = "-170px"
      el.style.transform = `translate(${x}, ${y}) rotateY(0)`
    },
    drawThreeAfterEnter: function (el) {
      let d = el.dataset.index * 250
      let y = 0
      let x = `${el.dataset.index * -25 + 100}px`
      setTimeout(function () {
        el.style.transform = `translate(${x}, ${y}) rotateY(0)`
      }, d)
    },
    warCardBeforeEnter: function (el) {
      el.style.transform = `translate(-340px, 0) rotateY(180deg)`
    },
    warCardAfterEnter: function (el) {
      let y = "100px"
      if (this.playerId === "p2") {
        y = "-" + y
      }
      el.style.transform = `translate(0, ${y}) rotateY(180deg)`
    }
  },
  components: {
    Card
  },
  created: function () {
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
.play-card-enter-active,
.draw-three-enter-active,
.war-card-enter-active {
  transition: all .5s;
}
</style>
