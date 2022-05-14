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
          <div class="left-board">
            <n-grid
              :cols="8"
              :x-gap="2"
              :y-gap="2"
              class="dark:bg-gray-200"
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
// import SvgIcon from '@/components/SvgIcon/index.vue';
import { reactive, ref } from 'vue';
import screenfull from 'screenfull';
import ChessGrid from '@/view/HomePage/ChessGrid.vue';
import { Grid, ChessPiece } from './game.d';

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

// 棋盘初始化
function boardInit() {
  const board: Grid[] = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      board.push({
        x: i,
        y: j,
        canPlace: false,
        chessPiece: null,
      });
    }
  }
  // 中间四个格子摆放棋子
  board[27].chessPiece = 'white';
  // board[19].canPlace = true;
  board[28].chessPiece = 'black';
  board[35].chessPiece = 'black';
  board[36].chessPiece = 'white';
  return board;
}
const board = reactive(boardInit());

// 表单项，即游戏设置
const gameSetting = reactive({
  agent: '',
  selectedChessPiece: 'black',
});

// 游戏状态初始化
// 可以下棋的位置，即对应可以翻转的位置
type AvailablePos={
  position:number
  reverseList:number[] // 对应可翻转的位置
}
// interface GameState{
//   curChessPiece: ChessPiece,
//   whiteAvailablePos:AvailablePos[],
//   blackAvailablePos:AvailablePos[]
// }
// const gameState = reactive<GameState>({
//   curChessPiece: 'black',
//   whiteAvailablePos: [],
//   blackAvailablePos: [],
// });

class GameState {
  curChessPiece: ChessPiece;

  whiteAvailablePos:AvailablePos[];

  blackAvailablePos:AvailablePos[];

  constructor() {
    this.curChessPiece = 'black';
    this.whiteAvailablePos = [];
    this.blackAvailablePos = [];
  }

  findAvailablePos(curChessPiece:ChessPiece) {
    const marginPos = [];
    const res:AvailablePos[] = [];
    for (let i = 0; i < 64; i++) {
      if (GameState.isMargin(i)) marginPos.push(i);
    }

    console.log(marginPos);
  }

  private static isMargin(index:number) {
    // console.log(board[0]);
    if (board[index].chessPiece !== null) return false;
    const x = Math.floor(index / 8);
    const y = index % 8;
    // eslint-disable-next-line no-restricted-syntax
    for (const i of [-1, 0, 1]) {
      // eslint-disable-next-line no-restricted-syntax
      for (const j of [-1, 0, 1]) {
        if (GameState.hasChessPiece(x + i, y + j)) return true;
      }
    }
    return false;
  }

  private static hasChessPiece(x:number, y:number) {
    return !(x < 0 || x > 7 || y < 0 || y > 7 || board[8 * x + y].chessPiece === null);
  }
}
const gameState = new GameState();
gameState.findAvailablePos('black');
// gameState.isMargin();
// const curChessPiece = ref<ChessPiece>('black');
// const whiteAvailablePos = ref<AvailablePos>([]);
// if (gameSetting.selectedChessPiece === curChessPiece.value) { console.log('yes'); }

function changePieceType() {
  board[27].chessPiece = board[27].chessPiece === 'white' ? 'black' : 'white';
}

// 落子函数
function putDown(index:number) {
  if (!board[index].canPlace) {
    window.$message.warning(
      `不可在此区域落子:${index}`,
    );
  } else {
    board[index].chessPiece = gameState.curChessPiece;
    board[index].canPlace = false;
    gameState.curChessPiece = gameState.curChessPiece === 'black' ? 'white' : 'black';
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

.left-board{
  display:flex;
  flex:5;
  justify-content:center;
  align-items:center;
}

.right-pannel{
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
</style>
