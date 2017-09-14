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
      @after-enter="playCardAfterEnter"
      @before-leave="playCardBeforeLeave">
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
        @before-enter="drawThreeBeforeEnter"
        @after-enter="drawThreeAfterEnter"
        @before-leave="drawThreeBeforeLeave">
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
        @after-enter="warCardAfterEnter"
        @before-leave="warCardBeforeLeave">
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
    playCardBeforeLeave: function (el) {
      if (!this.warCard.length) {
        let x = "-85px"
        let y = `${310 * this.collectUpDown()}px`
        el.style.transform = `translate(${x}, ${y})`
      }
    },
    drawThreeBeforeEnter: function (el) {
      let y = 0
      let x = `-${(parseInt(el.dataset.index) + 1) * 75 + 85}px`
      el.style.transform = `translate(${x}, ${y}) rotateY(0)`
    },
    drawThreeAfterEnter: function (el) {
      let d = el.dataset.index * 250
      let y = 0
      let x = `${el.dataset.index * -25}px`
      setTimeout(function () {
        el.style.transform = `translate(${x}, ${y}) rotateY(0)`
      }, d)
    },
    drawThreeBeforeLeave: function (el) {
      let y = `${310 * this.collectUpDown()}px`
      let x = `-${(parseInt(el.dataset.index) + 1) * 75 + 85}px`
      el.style.transform = `translate(${x}, ${y})`
    },
    warCardBeforeEnter: function (el) {
      el.style.transform = `translate(-385px, 0) rotateY(180deg)`
    },
    warCardAfterEnter: function (el) {
      let y = "100px"
      if (this.playerId === "p2") {
        y = "-" + y
      }
      el.style.transform = `translate(0, ${y}) rotateY(180deg)`
    },
    warCardBeforeLeave: function (el) {
      let y = `${310 * this.collectUpDown()}px`
      let x = "-385px"
      el.style.transform = `translate(${x}, ${y})`
    },
    collectUpDown: function () {
      if (this.drawWinner === this.playerId) {
        return 0
      } else if (this.drawWinner === "p2") {
        return 1
      }
      return -1
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
  height: 300px;
  max-height: 300px;
  align-items: center;
  margin-bottom: 10px;
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
.war-card-enter-active,
.play-card-leave-active,
.draw-three-leave-active,
.war-card-leave-active {
  transition: all 0.5s;
}
@media screen and (min-width: 480px) and (max-width: 720px) {
  .player-hand {
    width: 100%;
    padding: 10px;
  }
}
</style>
