<template>
  <div class="tetris-page">
    <h1 class="tetris-page__title">Тетрис</h1>

    <div class="tetris-page__game-area">
      <div class="tetris-page__board">
        <div
          v-for="(row, y) in displayBoard"
          :key="y"
          class="tetris-page__board-row"
        >
          <div
            v-for="(cell, x) in row"
            :key="x"
            class="tetris-page__board-cell"
            :class="{
              'tetris-page__board-cell_filled': cell > 0,
              'tetris-page__board-cell_ghost': cell === GHOST_VALUE,
            }"
            :style="cell > 0 ? getCellColor(cell) : {}"
          ></div>
        </div>
      </div>

      <div class="tetris-page__info-panel">
        <InfoPanel
          :next-piece-board="nextPieceBoard"
          :lines-cleared="linesCleared"
          :game-status="gameStatus"
          :get-cell-color="getCellColor"
          :difficulty="difficulty"
          :on-difficulty-changed="actions.changeDifficulty"
        />
        <Controls
          :game-status="gameStatus"
          :actions="actions"
        />
      </div>
    </div>

    <div class="tetris-page__navigation">
      <RouterLink
        :to="{ name: $routes.INDEX }"
        class="tetris-page__nav-link"
      >
        To Index
      </RouterLink>
      <RouterLink
        :to="{ name: $routes.EXAMPLE }"
        class="tetris-page__nav-link"
      >
        To Example
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import InfoPanel from '../ui/InfoPanel.vue'
import Controls from '../ui/Controls.vue'
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  GHOST_VALUE,
  NEXT_PIECE_SIZE,
  MIN_HUE,
  MAX_HUE,
  MIN_SATURATION,
  MAX_SATURATION,
  MIN_LIGHTNESS,
  MAX_LIGHTNESS,
  MAX_COLOR_ID,
  GHOST_BACKGROUND,
  ERROR_COLOR,
  GAME_STATUS,
  CONTROLS,
  DIFFICULTY,
  BASE_SPEEDS,
  PIECE_SHAPES
} from '../../constants/constants'

interface Cell {
  value: number
  color: string | null
  colorId: number | null
}

interface Piece {
  shape: number[][]
  color: string
  colorId: number
}

const board = ref<Cell[][]>([])
const currentPiece = ref<Piece | null>(null)
const nextPiece = ref<Piece | null>(null)
const currentX = ref(0)
const currentY = ref(0)
const linesCleared = ref(0)
const gameStatus = ref<string>(GAME_STATUS.IDLE)
const difficulty = ref<string>(DIFFICULTY.MEDIUM)
let gameInterval: ReturnType<typeof setInterval> | null = null

const generateRandomColor = (): string => {
  const hue = Math.floor(Math.random() * (MAX_HUE - MIN_HUE) + MIN_HUE)
  const saturation = MIN_SATURATION + Math.floor(Math.random() * MAX_SATURATION)
  const lightness = MIN_LIGHTNESS + Math.floor(Math.random() * MAX_LIGHTNESS)
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

const createPiece = (shape: number[][]): Piece => ({
  shape: shape.map((row) => [...row]),
  color: generateRandomColor(),
  colorId: Math.floor(Math.random() * MAX_COLOR_ID),
})

const getRandomPiece = (): Piece => {
  const randomIndex = Math.floor(Math.random() * PIECE_SHAPES.length)
  return createPiece(PIECE_SHAPES[randomIndex] as number[][])
}

const collision = (shape: number[][], offsetX: number, offsetY: number): boolean => {
  return shape.some((row, y) =>
    row.some((cell, x) => {
      if (cell === 0) {
        return false
      }
      const boardX = offsetX + x
      const boardY = offsetY + y
      if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) { 
        return true
      }
      if (boardY >= 0 && board.value[boardY]?.[boardX]?.value !== 0) {
        return true
      }
      return false
    })
  )
}

const actions = {
  initBoard: () => {
    board.value = Array(BOARD_HEIGHT)
      .fill(0)
      .map(() =>
        Array(BOARD_WIDTH)
          .fill(0)
          .map(
            (): Cell => ({
              value: 0,
              color: null,
              colorId: null,
            })
          )
      )
  },

  setNextPiece: (piece: Piece | null) => {
    nextPiece.value = piece
  },

  setCurrentPiece: (piece: Piece | null) => {
    currentPiece.value = piece
  },

  setCurrentPosition: (x: number, y: number) => {
    currentX.value = x
    currentY.value = y
  },

  setGameStatus: (status: string) => {
    gameStatus.value = status
  },

  addLines: (lines: number) => {
    linesCleared.value += lines
    startGameLoop()
  },

  resetLines: () => {
    linesCleared.value = 0
  },

  mergePieceToBoard: () => {
    if (!currentPiece.value) {
      return
    }
    const piece = currentPiece.value
    const posX = currentX.value
    const posY = currentY.value
    piece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell !== 0) {
          const boardY = posY + y
          const boardX = posX + x
          if (boardY >= 0 
          && boardY < BOARD_HEIGHT 
          && boardX >= 0 
          && boardX < BOARD_WIDTH 
          && board.value[boardY][boardX].value === 0) {
            board.value[boardY][boardX] = {
              value: piece.colorId,
              color: piece.color,
              colorId: piece.colorId,
            }
          }
        }
      })
    })
  },

  removeFullLines: () => {
    let linesRemoved = 0
    let y = BOARD_HEIGHT - 1
    while (y >= 0) {
      if (board.value[y].every(cell => cell.value !== 0)) {
        board.value.splice(y, 1)
        board.value.unshift(
          Array(BOARD_WIDTH).fill(0).map(() => ({ 
            value: 0, color: null, colorId: null 
          }))
        )
        linesRemoved++
      } else {
        y--
      }
    }
    if (linesRemoved > 0) {
      actions.addLines(linesRemoved)
    }
  },

  spawnNewPiece: () => {
    if (!nextPiece.value) {
      actions.setNextPiece(getRandomPiece())
    }

    actions.setCurrentPiece(JSON.parse(JSON.stringify(nextPiece.value)))
    actions.setNextPiece(getRandomPiece())

    const newX = Math.floor((BOARD_WIDTH - (currentPiece.value?.shape[0].length || 0)) / 2)
    actions.setCurrentPosition(newX, 0)

    if (currentPiece.value 
    && collision(currentPiece.value.shape, currentX.value, currentY.value)) {
      actions.setGameStatus(GAME_STATUS.GAME_OVER)
      if (gameInterval) {
        clearInterval(gameInterval)
        gameInterval = null
      }
    }
  },

  initGame: () => {
    actions.initBoard()
    actions.setNextPiece(getRandomPiece())
    actions.spawnNewPiece()
    actions.resetLines()
    actions.setGameStatus(GAME_STATUS.IDLE)
  },

  movePieceLeft: () => {
    if (!currentPiece.value || gameStatus.value !== GAME_STATUS.PLAYING) {
      return
    }
    if (!collision(currentPiece.value.shape, currentX.value - 1, currentY.value)) {
      actions.setCurrentPosition(currentX.value - 1, currentY.value)
    }
  },

  movePieceRight: () => {
    if (!currentPiece.value || gameStatus.value !== GAME_STATUS.PLAYING) {
      return
    }
    if (!collision(currentPiece.value.shape, currentX.value + 1, currentY.value)) {
      actions.setCurrentPosition(currentX.value + 1, currentY.value)
    }
  },

  rotateCurrentPiece: () => {
    if (!currentPiece.value || gameStatus.value !== GAME_STATUS.PLAYING) {
      return
    }

    const rotated = currentPiece.value.shape[0].map((_, index) =>
      currentPiece.value!.shape.map((row) => row[index]).reverse()
    )

    if (!collision(rotated, currentX.value, currentY.value)) {
      actions.setCurrentPiece({
        ...currentPiece.value,
        shape: rotated,
      })
    } else {
      if (!collision(rotated, currentX.value - 1, currentY.value)) {
        actions.setCurrentPiece({
          ...currentPiece.value,
          shape: rotated,
        })
        actions.setCurrentPosition(currentX.value - 1, currentY.value)
      } else if (!collision(rotated, currentX.value + 1, currentY.value)) {
        actions.setCurrentPiece({
          ...currentPiece.value,
          shape: rotated,
        })
        actions.setCurrentPosition(currentX.value + 1, currentY.value)
      }
    }
  },

  movePieceDown: () => {
    if (!currentPiece.value || gameStatus.value !== GAME_STATUS.PLAYING) {
      return
    }

    if (!collision(currentPiece.value.shape, currentX.value, currentY.value + 1)) {
      actions.setCurrentPosition(currentX.value, currentY.value + 1)
    } else {
      actions.mergePieceToBoard()
      actions.removeFullLines()
      actions.spawnNewPiece()
    }
  },

  hardDropPiece: () => {
    if (!currentPiece.value || gameStatus.value !== GAME_STATUS.PLAYING) {
      return
    }

    let y = currentY.value
    while (!collision(currentPiece.value.shape, currentX.value, y + 1)) {
      y++
    }
    actions.setCurrentPosition(currentX.value, y)
    actions.mergePieceToBoard()
    actions.removeFullLines()
    actions.spawnNewPiece()
  },

  toggleGamePause: () => {
    if (gameStatus.value === GAME_STATUS.PLAYING) {
      actions.setGameStatus(GAME_STATUS.PAUSED)
      if (gameInterval) {
        clearInterval(gameInterval)
        gameInterval = null
      }
    } else if (gameStatus.value === GAME_STATUS.PAUSED) {
      actions.setGameStatus(GAME_STATUS.PLAYING)
      startGameLoop()
    } else if (gameStatus.value === GAME_STATUS.IDLE) {
      actions.setGameStatus(GAME_STATUS.PLAYING)
      startGameLoop()
    } else if (gameStatus.value === GAME_STATUS.GAME_OVER) {
      actions.initGame()
      actions.setGameStatus(GAME_STATUS.PLAYING)
      startGameLoop()
    }
  },

  changeDifficulty: (newDifficulty: string) => {
    difficulty.value = newDifficulty
    startGameLoop()
  },

  resetGame: () => {
    if (gameInterval) {
      clearInterval(gameInterval)
      gameInterval = null
    }
    actions.initGame()
  },
}

const ghostY = computed(() => {
  if (!currentPiece.value || gameStatus.value !== GAME_STATUS.PLAYING) {
    return currentY.value
  }
  let y = currentY.value
  while (!collision(currentPiece.value.shape, currentX.value, y + 1)) {
    y++
  }
  return y
})

const displayBoard = computed(() => {
  const display = board.value.map(row => row.map(cell => (cell.value > 0 ? cell.value : 0)))

  if (currentPiece.value && gameStatus.value === GAME_STATUS.PLAYING) {
    const piece = currentPiece.value
    const ghostYVal = ghostY.value
    const curX = currentX.value
    const curY = currentY.value

    piece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell > 0) {
          const boardY = ghostYVal + y
          const boardX = curX + x
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            if (display[boardY][boardX] === 0) {
              display[boardY][boardX] = GHOST_VALUE
            }
          }
        }
      })
    })

    piece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell > 0) {
          const boardY = curY + y
          const boardX = curX + x
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            display[boardY][boardX] = piece.colorId
          }
        }
      })
    })
  }

  return display
})

const nextPieceBoard = computed(() => {
  if (!nextPiece.value) {
    return Array(NEXT_PIECE_SIZE)
      .fill(0)
      .map(() => Array(NEXT_PIECE_SIZE).fill(0))
  }

  const result = Array(NEXT_PIECE_SIZE)
    .fill(0)
    .map(() => Array(NEXT_PIECE_SIZE).fill(0))

  nextPiece.value.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell > 0) {
        result[y][x] = nextPiece.value!.colorId
      }
    })
  })

  return result
})

const baseInterval = computed(() => BASE_SPEEDS[difficulty.value])
const currentInterval = computed(() => {
  const factor = 1 + linesCleared.value * 0.01

  return Math.max(baseInterval.value / factor, 50) //no faster than 50ms
})

const getCellColor = (colorId: number) => {
  if (colorId === GHOST_VALUE) {
    return { backgroundColor: GHOST_BACKGROUND }
  }

  const cell = board.value.flat().find(c => c.colorId === colorId)
  if (cell) return { backgroundColor: cell.color }

  if (currentPiece.value?.colorId === colorId) {
    return { backgroundColor: currentPiece.value.color }
  }
  if (nextPiece.value?.colorId === colorId) {
    return { backgroundColor: nextPiece.value.color }
  }

  return { backgroundColor: ERROR_COLOR }
}

const startGameLoop = () => {
  if (gameInterval) {
    clearInterval(gameInterval)
  }

  gameInterval = setInterval(() => {
    if (gameStatus.value === GAME_STATUS.PLAYING) {
      actions.movePieceDown()
    }
  }, currentInterval.value)
}

onMounted(() => {
  actions.initGame()
})

onUnmounted(() => {
  if (gameInterval) {
    clearInterval(gameInterval)
  }
})
</script>

<style scoped lang="scss">
.tetris-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

  &__title {
    text-align: center;
    color: #ffffff;
    margin-bottom: 30px;
  }

  &__game-area {
    display: flex;
    gap: 30px;
    justify-content: center;
    flex-wrap: wrap;
  }

  &__board {
    background-color: #000000;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(255, 255, 255, 0.1);
  }

  &__board-row {
    display: flex;
  }

  &__board-cell {
    width: 30px;
    height: 30px;
    border: 1px solid #333333;
    background-color: #000000;
    transition: background-color 0.1s;

    &_ghost {
      background-color: rgba(255, 255, 255, 0.1);
      border: 1px dashed #666666;
    }
  }

  &__info-panel {
    min-width: 150px;
    padding: 20px;
    background-color: #1a1a1a;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &__navigation {
    margin-top: 30px;
    text-align: center;
    display: flex;
    gap: 15px;
    justify-content: center;
  }

  &__nav-link {
    display: inline-block;
    margin: 0 10px;
    padding: 8px 16px;
    color: #ffffff;
    text-decoration: none;
    border: 1px solid #ffffff;
    border-radius: 4px;
    transition: all 0.3s;

    &:hover {
      background-color: #ffffff;
      color: #000000;
    }
  }
}
</style>
