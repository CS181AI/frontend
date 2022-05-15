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
            <div style="width: 100%">
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
                  >
                    开始
                  </n-button>
                </n-form-item>
              </n-form>
            </div>
            <div>
              <n-button
                strong
                secondary
                type="success"
                @click="print"
              >
                Start
              </n-button>
              <br>
              当前棋子颜色{{ gameState.curChessPiece }}
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
import ModeSwitch from '@/components/ModeSwitch/ModeSwitch.vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
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
// eslint-disable-next-line no-unused-vars
enum Direction{TOPLEFT, TOP, TOPRIGHT, LEFT, RIGHT, BOTTOMLEFT, BOTTOM, BOTTOMRIGHT}
class GameState {
  curChessPiece: ChessPiece;

  availablePos: { 'white': AvailablePos[]; 'black': AvailablePos[]; };

  isEnd:boolean;

  constructor() {
    this.curChessPiece = 'black';
    this.isEnd = false;
    const whiteAvailablePos:AvailablePos[] = [];
    const blackAvailablePos:AvailablePos[] = [];
    this.availablePos = { white: whiteAvailablePos, black: blackAvailablePos };
    this.findAvailablePos();
  }

  putDown(index:number) {
    board[index].chessPiece = this.curChessPiece;
    board[index].canPlace = false;
    const temp = this.curChessPiece === 'white' ? 'white' : 'black';
    const reverseList = this.availablePos[temp].filter((item) => item.position === index);
    reverseList[0].reverseList.forEach((item) => {
      board[item].chessPiece = this.curChessPiece;
    });
    this.curChessPiece = this.curChessPiece === 'black' ? 'white' : 'black';
    this.findAvailablePos();
    const color = this.curChessPiece === 'white' ? 'white' : 'black';
    if (this.availablePos[color].length === 0) {
      this.curChessPiece = this.curChessPiece === 'black' ? 'white' : 'black';
    }
    this.findAvailablePos();
    const color1 = this.curChessPiece === 'white' ? 'white' : 'black';
    if (this.availablePos[color1].length === 0) {
      this.isEnd = true;
    }
  }

  findAvailablePos() {
    const marginPos:number[] = [];
    const res:AvailablePos[] = [];
    for (let i = 0; i < 64; i++) {
      if (GameState.isMargin(i)) { marginPos.push(i); }
    }
    // console.log(marginPos);
    // 对每一个边缘点判断其是否可以落子
    for (const i of marginPos) {
      const { x, y } = board[i];
      let reverseList:number[] = [];
      // 遍历8个方向
      const directions = Object.values(Direction)
        .filter((v) => !Number.isNaN(Number(v))) as number[];
      for (const direction of directions) {
        // 将8个方向中存在可以翻转的index存入reverseList中
        reverseList = reverseList.concat(this.checkPath(x, y, direction));
      }
      // 如果存在可翻转的index表示当前i边缘点可以落子
      if (reverseList.length !== 0) {
        res.push({ position: i, reverseList });
      }
    }
    const temp = this.curChessPiece === 'white' ? 'white' : 'black';
    this.availablePos[temp] = res;
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

  private checkPath(x:number, y:number, direction:Direction):number[] {
    let x_ = x;
    let y_ = y;
    let res:number[] = [];
    let i = 0;
    let j = 0;
    switch (direction) {
      case Direction.TOPLEFT:
        i = -1;
        j = -1;
        break;
      case Direction.TOP:
        j = -1;
        break;
      case Direction.TOPRIGHT:
        i = 1;
        j = -1;
        break;
      case Direction.LEFT:
        i = -1;
        break;
      case Direction.RIGHT:
        i = 1;
        break;
      case Direction.BOTTOMLEFT:
        i = -1;
        j = 1;
        break;
      case Direction.BOTTOM:
        j = 1;
        break;
      case Direction.BOTTOMRIGHT:
        i = 1;
        j = 1;
        break;

      default:
        return res;
    }
    if (!GameState.hasChessPiece(x_ + i, y_ + j)
        || board[x_ + i + 8 * (y_ + j)].chessPiece === this.curChessPiece) {
      return res;
    }
    while (true) {
      x_ += i;
      y_ += j;
      if (!GameState.hasChessPiece(x_, y_)) {
        res = [];
        break;
      } else if (board[x_ + 8 * y_].chessPiece !== this.curChessPiece) {
        res.push(x_ + 8 * y_);
      } else {
        break;
      }
    }
    return res;
  }

  private static isMargin(index:number) {
    if (board[index].chessPiece !== null) return false;
    const { x, y } = board[index];
    for (const i of [-1, 0, 1]) {
      for (const j of [-1, 0, 1]) {
        if (GameState.hasChessPiece(x + i, y + j)) return true;
      }
    }
    return false;
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
