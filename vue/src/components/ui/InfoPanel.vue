<template>
  <div class="info-panel-content">
    <div class="next-piece">
      <h3>{{ TEXTS.NEXT_PIECE }}</h3>
      <div class="next-board">
        <div v-for="(row, y) in nextPieceBoard" :key="y" class="board-row">
          <div
            v-for="(cell, x) in row"
            :key="x"
            class="board-cell small"
            :class="{ filled: cell > 0 }"
            :style="cell > 0 ? getCellColor(cell) : {}"
          ></div>
        </div>
      </div>
    </div>

    <div class="lines">
      <h3>{{ TEXTS.LINES }}</h3>
      <div class="lines-value">{{ linesCleared }}</div>
    </div>

    <div class="game-status">
      <h3 v-if="gameStatus === GAME_STATUS.GAME_OVER">{{ TEXTS.GAME_OVER }}</h3>
      <h3 v-else-if="gameStatus === GAME_STATUS.PAUSED">{{ TEXTS.PAUSED }}</h3>
      <h3 v-else-if="gameStatus === GAME_STATUS.IDLE">{{ TEXTS.IDLE }}</h3>
      <h3 v-else>{{ TEXTS.PLAYING }}</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TEXTS, GAME_STATUS } from '../../constants/constants'

defineProps<{
  nextPieceBoard: number[][]
  linesCleared: number
  gameStatus: string
  getCellColor: (colorId: number) => { backgroundColor: string }
}>()
</script>

<style scoped lang="scss">
.next-piece {
  text-align: center;
  margin-bottom: 20px;
}

.next-board {
  background-color: #000000;
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
  display: inline-block;
}

.board-row {
  display: flex;
  justify-content: center;
}

.board-cell {
  width: 30px;
  height: 30px;
  border: 1px solid #333333;
  background-color: #000000;
  transition: background-color 0.1s;
}

.board-cell.small {
  width: 20px;
  height: 20px;
}

.board-cell.filled {
  background-color: #ff4444;
}

.lines {
  margin: 15px 0;
  text-align: center;
}

.lines-value {
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
}

.game-status {
  text-align: center;
  margin: 20px 0;
  padding: 10px;
  background-color: #333333;
  color: #ffffff;
  border-radius: 4px;
}
</style>