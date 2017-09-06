<template>
  <div>
  </div>
</template>

<script>
import { mapMutations } from "vuex"
export default {
  name: "deck",
  data () {
    return {
      numbers: [1,2,3,4,5,6,7,8,9,10,11,12,13],
      suits: ["Hearts", "Clubs", "Diamonds", "Spades"],
      deck: [],
    }
  },
  methods: {
    shuffle: function () {
      if (this.deck) {
        this.deck = []
      }
      let cards = []
      Object.assign(cards, this.cards)
      for (var i = 0; i < 52; i++) {
        let r = 52 - this.deck.length
        let c = Math.floor(Math.random() * r)
        this.deck.push(cards[c])
        cards.splice(c, 1)
      }
      this.evtHub.$emit("shuffled", this.deck)
      this.deal()
    },
    deal: function () {
      let h1 = []
      let h2 = []
      for (var i = 0; i < 52; i++) {
        if (i % 2 == 0) {
          h1.push(this.deck[i])
        } else {
          h2.push(this.deck[i])
        }
      }
      this.storeDeal({player: "p1", cards: h1})
      this.storeDeal({player: "p2", cards: h2})
      this.evtHub.$emit("deal", h1, h2)
    },
    createCards: function () {
    },
    ...mapMutations({
      storeDeal: "deal"
    })
  },
  computed: {
    cards: function () {
      let d = []
      let vm = this
      this.numbers.forEach(function (v) {
        vm.suits.forEach(function (u) {
          d.push({value: v, suit: u})
        })
      })
      return d
    }
  },
  created: function () {
    this.shuffle()
    this.evtHub.$on("redeal", this.shuffle)
  }
}
</script>

<style scoped>
</style>
