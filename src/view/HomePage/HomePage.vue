<template>
  <n-layout-content content-style="min-height: 100vh">
    <div class="content-container">
      <!--      <span style="font-size:66px;letter-spacing:8px;padding:15px">黑白棋</span>-->
      <span class="py-6 text-6xl tracking-widest">黑白棋</span>
      <n-card
        id="card"
        hoverable
        style="width: 60%;min-height: 300px;margin-bottom: 5px"
      >
        <div class="flex">
          <div style="display:flex;flex:5;justify-content:center;align-items:center;">
            <n-grid
              :cols="8"
              :x-gap="2"
              :y-gap="2"
              class="dark:bg-gray-300"
              style="width: 80%"
            >
              <n-grid-item
                v-for="(item,index) of board"
                :key="index"
                @click="putDown(index)"
              >
                <ChessGrid
                  :index="index"
                  :grid="item"
                />
              </n-grid-item>
            </n-grid>
          </div>
          <div class="right-pannel">
            <div>
              <n-button
                strong
                secondary
                type="success"
                @click="changePieceType"
              >
                Start
              </n-button>
            </div>
            <div>
              <n-button @click="toggleScreen">
                Default
              </n-button>
              <div style="width:32px">
                <ModeSwitch />
              </div>
            </div>
          </div>
        </div>
      </n-card>
    </div>
  </n-layout-content>
</template>
<script setup lang="ts">
import ModeSwitch from '@/components/ModeSwitch/ModeSwitch.vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import { computed, reactive } from 'vue';
import screenfull from 'screenfull';
import ChessGrid from './chessGrid.vue';
import Grid from './game.d';

function toggleScreen() {
  if (screenfull.isEnabled) {
    // const element = document.getElementById('card');
    // screenfull.request(element);
    screenfull.request();
  }
}

function print(id:number) {
  window.$message.success(
    `你点击了${id}`,
  );
}

function boardInit() {
  const board: Grid[] = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      board.push({
        x: i,
        y: j,
        canPlace: false,
        chessPieceType: null,
      });
    }
  }
  // 中间四个格子摆放棋子
  board[27].chessPieceType = 'white';
  board[19].canPlace = true;
  board[28].chessPieceType = 'black';
  board[35].chessPieceType = 'black';
  board[36].chessPieceType = 'white';
  return board;
}
const board = reactive(boardInit());
function changePieceType() {
  board[27].chessPieceType = board[27].chessPieceType === 'white' ? 'black' : 'white';
}
function putDown(index:number) {
  if (!board[index].canPlace) {
    window.$message.warning(
      `不可在此区域落子:${index}`,
    );
  } else {
    board[index].chessPieceType = 'black';
  }
}
</script>

<style scoped>
.content-container{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.right-pannel{
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
</style>
