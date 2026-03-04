<template>
  <div class="info-panel">
    <div class="info-panel__next-piece">
      <h3 class="info-panel__heading">Следующая:</h3>
      <div class="info-panel__next-board">
        <div
          v-for="(row, y) in nextPieceBoard"
          :key="y"
          class="info-panel__board-row"
        >
          <div
            v-for="(cell, x) in row"
            :key="x"
            class="info-panel__board-cell"
            :class="{ 'info-panel__board-cell_filled': cell > 0 }"
            :style="cell > 0 ? getCellColor(cell) : {}"
          ></div>
        </div>
      </div>
    </div>

    <div class="info-panel__difficulty">
      <h3 class="info-panel__difficulty__header">Сложность</h3>
      <div class="info-panel__difficulty__selector">
        <select 
        :disabled="gameStatus !== GAME_STATUS.IDLE && gameStatus !== GAME_STATUS.GAME_OVER"
        :value="difficulty" 
        @change="(e) => emitDifficultyChange(e)"
        >
          <option :value="DIFFICULTY.EASY">Легкая</option>
          <option :value="DIFFICULTY.MEDIUM">Средняя</option>
          <option :value="DIFFICULTY.HARD">Сложная</option>
        </select>
      </div>
    </div>

    <div class="info-panel__lines">
      <h3 class="info-panel__heading">Линий:</h3>
      <div class="info-panel__lines-value">{{ linesCleared }}</div>
    </div>

    <div class="info-panel__game-status">
      <h3 v-if="gameStatus === GAME_STATUS.GAME_OVER" class="info-panel__status-text">
        Игра окончена!
      </h3>
      <h3 v-else-if="gameStatus === GAME_STATUS.PAUSED" class="info-panel__status-text">
        Пауза
      </h3>
      <h3 v-else-if="gameStatus === GAME_STATUS.IDLE" class="info-panel__status-text">
        Готово к игре
      </h3>
      <h3 v-else class="info-panel__status-text">
        Игра идет
      </h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GAME_STATUS, DIFFICULTY} from '../../constants/constants'

const { onDifficultyChanged } = defineProps<{
  nextPieceBoard: number[][]
  linesCleared: number
  gameStatus: string
  getCellColor: (colorId: number) => { backgroundColor: string }
  difficulty: string
  onDifficultyChanged: (newDifficulty: string) => void
}>()

const emitDifficultyChange = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value

  return onDifficultyChanged?.(value)
}
</script>

<style scoped lang="scss">
.info-panel {
  &__next-piece {
    text-align: center;
    margin-bottom: 20px;
  }

  &__heading {
    margin: 0 0 10px 0;
    color: #ffffff;
  }

  &__next-board {
    background-color: #000000;
    padding: 10px;
    border-radius: 8px;
    margin-top: 10px;
    display: inline-block
  }

  &__board-row {
    display: flex;
    justify-content: center;
  }

  &__board-cell {
    width: 20px;
    height: 20px;
    border: 1px solid #333333;
    background-color: #000000;
    transition: background-color 0.1s;
  }

  &__difficulty {
    &__header {
      margin: 15px 0;
      text-align: center;
      font-size: 20px;
      color: #ffffff;
    }

    &__selector {
      select {
        appearance: none;
        width: 100%;
        background-color: #2a2a2a;
        color: #ffffff;
        cursor: pointer;
        text-align: center;
      }

      justify-content: center;

      &:hover {
        border-color: #666;
        background-color: #333;
      }
      
      &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
    }
  }

  &__lines {
    margin: 15px 0;
    text-align: center;
  }

  &__lines-value {
    font-size: 24px;
    font-weight: bold;
    color: #ffffff;
  }

  &__game-status {
    text-align: center;
    margin: 20px 0;
    padding: 10px;
    background-color: #333333;
    color: #ffffff;
    border-radius: 4px;
  }

  &__status-text {
    margin: 0;
    font-size: 1.2em;
  }
}
</style>