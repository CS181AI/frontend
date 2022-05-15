<template>
  <div
    v-if="props.index%2"
    class="light-green"
  >
    <div
      v-if="props.grid.chessPiece==='black'"
      class="chess-piece-black"
    />
    <div
      v-else-if="props.grid.chessPiece==='white'"
      class="chess-piece-white"
    />
    <HintCircle v-else-if="props.grid.showHint" />
  </div>
  <div
    v-else
    class="green"
  >
    <div
      v-if="props.grid.chessPiece==='black'"
      class="chess-piece-black"
    />
    <div
      v-else-if="props.grid.chessPiece==='white'"
      class="chess-piece-white"
    />
    <HintCircle v-else-if="props.grid.showHint" />
  </div>
</template>

<script lang="ts" setup>
import HintCircle from '@/view/HomePage/HintCircle.vue';
import { defineProps } from 'vue';
import { Grid } from './game.d';

interface Props {
  index: number
  grid:Grid
}
const props = defineProps<Props>();
</script>

<style scoped>
.light-green {
  height: 68px;
  background-color: rgba(0, 128, 0, 0.12);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.green {
  height: 68px;
  background-color: rgba(0, 128, 0, 0.24);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.chess-piece-black{
  background-color: black;
  width:36px;
  height:36px;
  border-radius: 50%;
  box-shadow: 0 2px 8px #333;
}
.chess-piece-white{
  background-color: white;
  width:36px;
  height:36px;
  border-radius: 50%;
  box-shadow: 0 2px 8px #333;
}
</style>
