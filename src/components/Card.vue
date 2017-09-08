<template>
  <transition 
    name="flipcard"
    v-on:before-enter="beforeEnter"
    v-on:after-enter="afterEnter"
    v-on:beforeLeave="beforeLeave"
    v-on:after-leave="afterLeave"
    enter-to-class="flipped">
    <div class="card-container" @click="flipAnimation()" v-bind:class="{ faceup: faceUp }">
      <div class="card front">
        <span class="suit" :class="suit">{{ suit }}</span>
        <span class="value" :class="suit">{{ value }}</span>
      </div>
      <div class="card back">
        {{ cardBack }}
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "card",
  props: {
    value: [Number, String],
    suit: String,
    type: String,
    cardBack: String,
    faceUp: Boolean,
    warKey: Number,
    owner: [String, Number],
    drawWinner: [Object, String],
  },
  data () {
    return {
      isFlipped: true,
    }
  },
  methods: {
    beforeEnter: function (el) {
      el.style.transform = "translate(-85px, 0) rotateY(0)"
    },
    enter: function (el, done) {
      el.style.transform = "translate(0, 0) rotateY(180deg)"
      done()
    },
    afterEnter: function (el) {
      let y = "-100px"
      let x = "50px"
      let d = "180deg"
      if (this.owner === "p1") {
        y = "100px"
      }
      if (!this.faceUp) {
        x = `${this.warKey * -25 + 100}px`
        y = 0
        d = 0
      }
      if (el.className.indexOf("war-card") >= 0) {
        x = y = 0
      }
      el.style.transform = `translate(${x}, ${y}) rotateY(${d})`
    },
    beforeLeave: function (el) {
      let x = "-85px"
      let y = 0
      let d = "180deg"
      if (el.className.indexOf("war-card") >= 0) {
        x = y = 0
      }
      if (this.drawWinner === this.owner) {
        y = "0"
      } else if (this.drawWinner === "p1" && this.owner === "p2") {
        y = "-300%"
      } else if (this.drawWinner === "p2" && this.owner === "p1") {
        y = "300%"
      }
      el.style.transform = `translate(${x}, ${y}) rotateY(${d})`
    },
    leave: function (el, done) {
      el.style.transform = "translate(0, 100%) rotateY(0)"
      done()
    },
    afterLeave: function (el) {
      el.style.transform = "translate(-85px, 0)"
    },
    flipAnimation: function () {
      /*if (this.type !== "deck") {
        this.isFlipped = !this.isFlipped
      }*/
    }
  },
  created: function () {
    this.evtHub.$on("drawBoth", this.flipAnimation)
  }
}
</script>

<style scoped>
.card-container {
  width: 75px;
  height: 100px;
  border: 2px solid #bbb;
  display: inline-block;
  position: relative;
  transform-style: preserve-3d;
  transition: transform .5s;
}
.card {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  backface-visibility: hidden;
  background-color: #dedede;
}
.front {
  transform: rotateY(180deg);
}
.back {
  transform: rotateY(0);
}
.suit, .value {
  font-size: 10pt;
  display: block;
}
.Diamonds, .Hearts {
  color: red;
}
.Clubs, .Spades {
  color: black;
}
.flipped {
  transform: rotateY(180deg)
}
.faceup {
  transform: rotateY(0);
}
.flipcard-enter, .flipcard-leave {
  transform: translate(0, 100%) rotateY(0deg);
}
.flipcard-enter-to, .flipcard-leave-to, .v-enter-to {
  transform: rotateY(180deg);
}
.flipcard-enter-active, .flipcard-leave-active {
  transition: all .5s;
}
</style>
