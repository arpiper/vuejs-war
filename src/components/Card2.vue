<template>
  <div class="card-container" :class="{ faceup: faceUp }">
    <div class="card front">
      <span class="suit" :class="suit">{{ suit }}</span>
      <span class="value" :class="suit">{{ value }}</span>
    </div>
    <div class="card back">
      {{ back }}
    </div>
  </div>
</template>

<script>

export default {
  name: "card2",
  props: {
    value: [String, Number],
    suit: String,
    faceUp: Boolean,
    back: String,
  },
}
</script>

<style scoped>
.card-container {
  width: 75px;
  height: 100px;
  position: relative;
  display: inline-block;
  transform-style: preserve-3d;
  transition: transform .5s;
  border: 2px solid #bbb;
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
.suit, .value {
  font-size: 10pt;
  display: block;
}
.front, .faceup {
  transform: rotateY(180deg);
}
.back {
  transform: rotateY(0);
}
.diamonds, .hearts {
  color: red;
}
</style>
