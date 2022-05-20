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
              style="width: 88%"
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
            <div class="w-full">
              <n-form
                label-placement="left"
                :model="gameSetting"
              >
                <n-form-item label="模式选择">
                  <n-select
                    v-model:value="gameSetting.agent"
                    :options="options"
                  />
                </n-form-item>
                <n-form-item label="选择棋色">
                  <n-switch
                    v-model:value="gameSetting.selectedChessPiece"
                    checked-value="white"
                    unchecked-value="black"
                  >
                    <template #checked>
                      白棋
                    </template>
                    <template #unchecked>
                      <span style="color:black">黑棋</span>
                    </template>
                    <template #unchecked-icon>
                      <span style="font-size:16px">⚫</span>
                    </template>
                  </n-switch>
                </n-form-item>
                <n-form-item>
                  <n-button
                    strong
                    secondary
                    type="info"
                    class="w-full"
                    @click="nextStep"
                  >
                    开始
                  </n-button>
                </n-form-item>
              </n-form>
            </div>
            <ScoreBoard
              :cur-chess-piece="gameState.curChessPiece"
              :black-num="gameState.blackNum"
              :white-num="gameState.whiteNum"
            />
            <UtilFooter />
          </div>
        </div>
      </n-card>
    </div>

    <!--    结果显示-->
    <n-modal v-model:show="gameState.isEnd">
      <n-card
        style="width: 600px"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-result
          title="赢"
          status="success"
          description="失败的孩子"
        >
          <template #icon>
            <SvgIcon
              name="奖杯"
              size="180"
              class="mb-2"
            />
          </template>
          <template #footer>
            <LineChart
              :total-step="gameRecord.totalStep"
              :black-num-list="gameRecord.blackNumList"
              :white-num-list="gameRecord.whiteNumList"
            />
            <n-button
              strong
              secondary
              type="success"
            >
              再来一局
            </n-button>
          </template>
        </n-result>
      </n-card>
    </n-modal>
  </n-layout-content>
</template>
<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon/index.vue';
import { reactive } from 'vue';
import ChessGrid from '@/view/HomePage/ChessGrid.vue';
import ScoreBoard from '@/view/HomePage/ScoreBoard.vue';
import UtilFooter from '@/view/HomePage/UtilFooter.vue';
import getNextStep from '@/api/game';
import LineChart from '@/view/HomePage/LineChart.vue';
import { ChessPiece, Grid } from './game.d';

// 棋盘初始化
function boardInit() {
  const board: Grid[] = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      board.push({
        x: j,
        y: i,
        canPlace: false,
        chessPiece: null,
        showHint: false,
      });
    }
  }
  // 中间四个格子摆放棋子
  board[27].chessPiece = 'white';
  board[28].chessPiece = 'black';
  board[35].chessPiece = 'black';
  board[36].chessPiece = 'white';
  return board;
}
const board = reactive(boardInit());

// 表单项，即游戏设置
const options = [{ label: '双人模式', value: 1 }, { label: '蒙特卡洛', value: 2 }, { label: '强化学习', value: 3 }];
const gameSetting = reactive({
  agent: '',
  selectedChessPiece: 'black',
});

// 用于记录游戏数据
interface GameRecord{
  totalStep:number
  whiteNumList:number[]
  blackNumList:number[]
}
const gameRecord = reactive<GameRecord>({ totalStep: 0, whiteNumList: [], blackNumList: [] });

function print() {
  console.log(gameSetting.selectedChessPiece);
}

// 游戏状态初始化
// 可以下棋的位置，即对应可以翻转的位置
type AvailablePos={
  position:number
  reverseList:number[] // 对应可翻转的位置
}

// 定义方向枚举类
class GameState {
  curChessPiece: 'white'|'black';

  whiteNum:number;

  blackNum:number;

  availablePos: {[index:string]:AvailablePos[]};

  isEnd:boolean;

  constructor() {
    this.curChessPiece = 'black';
    this.whiteNum = 2;
    this.blackNum = 2;
    this.isEnd = false;
    const whiteAvailablePos:AvailablePos[] = [];
    const blackAvailablePos:AvailablePos[] = [];
    this.availablePos = { white: whiteAvailablePos, black: blackAvailablePos };
    this.findAvailablePos();
  }

  putDown(index:number) {
    let { blackNum } = this;
    let { whiteNum } = this;
    board[index].chessPiece = this.curChessPiece;
    board[index].canPlace = false;
    const reverseList = this.availablePos[this.curChessPiece]
      .filter((item) => item.position === index);
    reverseList[0].reverseList.forEach((item) => {
      const i = this.curChessPiece === 'white' ? 1 : -1;
      whiteNum += i;
      blackNum += (-1 * i);
      board[item].chessPiece = this.curChessPiece;
    });
    if (this.curChessPiece === 'white') whiteNum += 1;
    else blackNum += 1;
    this.blackNum = blackNum;
    this.whiteNum = whiteNum;
    gameRecord.totalStep += 1;
    gameRecord.blackNumList.push(blackNum);
    gameRecord.whiteNumList.push(whiteNum);

    this.curChessPiece = this.curChessPiece === 'black' ? 'white' : 'black';
    this.findAvailablePos();
    if (this.availablePos[this.curChessPiece].length === 0) {
      this.curChessPiece = this.curChessPiece === 'black' ? 'white' : 'black';
    }
    this.findAvailablePos();
    if (this.availablePos[this.curChessPiece].length === 0) {
      this.isEnd = true;
    }
  }

  findAvailablePos() {
    this.availablePos[this.curChessPiece] = board
      .map((grid, index) => {
        // 8个单位向量，代表左上、上，右上，左，右等
        const directions = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
        const reverseList = directions.map((direction) => this.checkPath(grid, direction));
        return { position: index, reverseList: reverseList.flat() };
      })
      .filter((item) => item.reverseList.length !== 0);
    this.showHint();
  }

  // 用于显示哪些格子可以落子
  private showHint() {
    board.forEach((item) => {
      item.showHint = false;
      item.canPlace = false;
    });
    const temp = this.curChessPiece === 'white' ? 'white' : 'black';
    this.availablePos[temp].forEach((item) => {
      board[item.position].showHint = true;
      board[item.position].canPlace = true;
    });
  }

  private checkPath(grid:Grid, direction:number[]):number[] {
    // 如果当前位置有tile，那么该区域一定不可落子
    if (GameState.hasChessPiece(grid.x, grid.y)) return [];
    let res:number[] = [];
    const i = direction[0];
    const j = direction[1];
    let { x, y } = grid;
    while (true) {
      x += i;
      y += j;
      if (!GameState.hasChessPiece(x, y)) {
        res = [];
        break;
      } else if (board[x + 8 * y].chessPiece !== this.curChessPiece) {
        res.push(x + 8 * y);
      } else {
        break;
      }
    }
    return res;
  }

  private static isValid(x:number, y:number) {
    return x >= 0 && x <= 7 && y >= 0 && y <= 7;
  }

  private static hasChessPiece(x:number, y:number) {
    return GameState.isValid(x, y) && board[x + 8 * y].chessPiece !== null;
  }
}
const gameState = reactive(new GameState());
// gameState.findAvailablePos();

interface GameInfo{
  selectedAgent:string
  agentChessPiece:ChessPiece
  gridList:Grid[]
}
const gameInfo:GameInfo = {
  selectedAgent: 'greedy',
  agentChessPiece: 'black',
  gridList: board,
};
function nextStep() {
  console.log('fsd');
  getNextStep(gameInfo).then((res) => putDown(res.pos));
}

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
    gameState.putDown(index);
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
  flex:3;
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
