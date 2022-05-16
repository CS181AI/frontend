<template>
  <div class="w-full bg-red-200/50 rounded flex flex-col items-center py-2">
    <div class="w-full flex items-center justify-evenly">
      <div class="flex flex-col items-center">
        <span class="text-5xl font-extrabold mb-1">{{ props.whiteNum }}</span>
        <span class="text-xs">⚪</span>
      </div>
      <span class="text-2xl font-bold">:</span>
      <div class="flex flex-col items-center">
        <span class="text-5xl font-extrabold mb-1">{{ props.blackNum }}</span>
        <span class="text-xs">⚫</span>
      </div>
    </div>
    <div class="mt-4">
      <span class="tracking-widest text-sm">当前棋子{{ color }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps } from 'vue';
import { ChessPiece } from '@/view/HomePage/game.d';

interface Props {
  curChessPiece: ChessPiece
  whiteNum:number
  blackNum:number
}
const props = defineProps<Props>();
const color = computed(() => (props.curChessPiece === 'white' ? '⚪' : '⚫'));

</script>

<style scoped>

</style>
