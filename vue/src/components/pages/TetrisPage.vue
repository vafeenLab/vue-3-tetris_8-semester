<template>
  <div class="tetris-container">
    <h1>{{ TEXTS.TITLE }}</h1>

    <div class="game-area">
      <div class="board">
        <div v-for="(row, y) in displayBoard" :key="y" class="board-row">
          <div v-for="(cell, x) in row" :key="x" class="board-cell" :class="{
            filled: cell > 0,
            ghost: cell === GHOST_VALUE,
          }" :style="cell > 0 ? getCellColor(cell) : {}"></div>
        </div>
      </div>

      <div class="info-panel">
        <div class="next-piece">
          <h3>{{ TEXTS.NEXT_PIECE }}</h3>
          <div class="next-board">
            <div v-for="(row, y) in nextPieceBoard" :key="y" class="board-row">
              <div v-for="(cell, x) in row" :key="x" class="board-cell small" :class="{ filled: cell > 0 }"
                :style="cell > 0 ? getCellColor(cell) : {}"></div>
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

        <div class="controls">
          <div class="control-row">
            <button @click="() => actions.movePieceLeft()" :disabled="gameStatus !== GAME_STATUS.PLAYING"
              class="control-btn">
              {{ CONTROLS.LEFT }}
            </button>
            <button @click="() => actions.movePieceRight()" :disabled="gameStatus !== GAME_STATUS.PLAYING"
              class="control-btn">
              {{ CONTROLS.RIGHT }}
            </button>
          </div>
          <div class="control-row">
            <button @click="() => actions.rotateCurrentPiece()" :disabled="gameStatus !== GAME_STATUS.PLAYING"
              class="control-btn">
              {{ CONTROLS.ROTATE }}
            </button>
            <button @click="() => actions.hardDropPiece()" :disabled="gameStatus !== GAME_STATUS.PLAYING"
              class="control-btn">
              {{ CONTROLS.DROP }}
            </button>
          </div>
          <div class="control-row">
            <button @click="() => actions.toggleGamePause()" class="control-btn pause-btn">
              {{ gameStatus === GAME_STATUS.PLAYING ? CONTROLS.PAUSE : CONTROLS.PLAY }}
            </button>
            <button @click="() => actions.resetGame()" class="control-btn reset-btn">
              {{ CONTROLS.RESET }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="navigation">
      <RouterLink :to="{ name: $routes.INDEX }" class="nav-link">
        {{ TEXTS.HOME }}
      </RouterLink>
      <RouterLink :to="{ name: $routes.EXAMPLE }" class="nav-link">
        {{ TEXTS.EXAMPLE }}
      </RouterLink>
      <RouterLink :to="{ name: $routes.DEMO }" class="nav-link">
        {{ TEXTS.DEMO }}
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const BASE_SPEED = 500
const GHOST_VALUE = -1
const NEXT_PIECE_SIZE = 4
const MIN_HUE = 0
const MAX_HUE = 360
const MIN_SATURATION = 70
const MAX_SATURATION = 30
const MIN_LIGHTNESS = 50
const MAX_LIGHTNESS = 20
const MAX_COLOR_ID = 1000000
const GHOST_BACKGROUND = 'rgba(255, 255, 255, 0.2)'
const ERROR_COLOR = '#ff4444'

const TEXTS = {
  TITLE: 'Тетрис',
  NEXT_PIECE: 'Следующая:',
  LINES: 'Линии:',
  GAME_OVER: 'Игра окончена!',
  PAUSED: 'Пауза',
  IDLE: 'Игра не началась',
  PLAYING: 'Игра идет',
  HOME: 'На главную',
  EXAMPLE: 'На Example',
  DEMO: 'На Demo',
} as const

const GAME_STATUS = {
  IDLE: 'idle',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver',
} as const

const CONTROLS = {
  LEFT: '←',
  RIGHT: '→',
  ROTATE: '↻',
  DROP: '↓',
  PAUSE: '⏸',
  PLAY: '▶',
  RESET: '↺',
} as const

const PIECE_SHAPES = [
  // I
  [[1, 1, 1, 1]],
  // O
  [[1, 1], [1, 1]],
  // T
  [[0, 1, 0], [1, 1, 1]],
  // S
  [[0, 1, 1], [1, 1, 0]],
  // Z
  [[1, 1, 0], [0, 1, 1]],
  // L
  [[1, 0, 0], [1, 1, 1]],
  // J
  [[0, 0, 1], [1, 1, 1]]
] as const

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
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x] !== 0) {
        const boardX = offsetX + x
        const boardY = offsetY + y

        if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
          return true
        }

        if (boardY >= 0 && board.value[boardY]?.[boardX]?.value !== 0) {
          return true
        }
      }
    }
  }
  return false
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
  },

  resetLines: () => {
    linesCleared.value = 0
  },

  mergePieceToBoard: () => {
    if (!currentPiece.value) return

    for (let y = 0; y < currentPiece.value.shape.length; y++) {
      for (let x = 0; x < currentPiece.value.shape[y].length; x++) {
        if (currentPiece.value.shape[y][x] !== 0) {
          const boardY = currentY.value + y
          const boardX = currentX.value + x

          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            if (board.value[boardY][boardX].value === 0) {
              board.value[boardY][boardX] = {
                value: currentPiece.value.colorId,
                color: currentPiece.value.color,
                colorId: currentPiece.value.colorId,
              }
            }
          }
        }
      }
    }
  },

  removeFullLines: () => {
    let linesRemoved = 0

    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (board.value[y].every((cell) => cell.value !== 0)) {
        board.value.splice(y, 1)
        board.value.unshift(
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
        y++
        linesRemoved++
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

    if (currentPiece.value && collision(currentPiece.value.shape, currentX.value, currentY.value)) {
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
    if (!currentPiece.value || gameStatus.value !== GAME_STATUS.PLAYING) return

    if (!collision(currentPiece.value.shape, currentX.value - 1, currentY.value)) {
      actions.setCurrentPosition(currentX.value - 1, currentY.value)
    }
  },

  movePieceRight: () => {
    if (!currentPiece.value || gameStatus.value !== GAME_STATUS.PLAYING) return

    if (!collision(currentPiece.value.shape, currentX.value + 1, currentY.value)) {
      actions.setCurrentPosition(currentX.value + 1, currentY.value)
    }
  },

  rotateCurrentPiece: () => {
    if (!currentPiece.value || gameStatus.value !== GAME_STATUS.PLAYING) return

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
    if (!currentPiece.value || gameStatus.value !== GAME_STATUS.PLAYING) return

    if (!collision(currentPiece.value.shape, currentX.value, currentY.value + 1)) {
      actions.setCurrentPosition(currentX.value, currentY.value + 1)
    } else {
      actions.mergePieceToBoard()
      actions.removeFullLines()
      actions.spawnNewPiece()
    }
  },

  hardDropPiece: () => {
    if (!currentPiece.value || gameStatus.value !== GAME_STATUS.PLAYING) return

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

  resetGame: () => {
    if (gameInterval) {
      clearInterval(gameInterval)
      gameInterval = null
    }
    actions.initGame()
  },
}

const ghostY = computed(() => {
  if (!currentPiece.value || gameStatus.value !== GAME_STATUS.PLAYING) return currentY.value
  let y = currentY.value
  while (!collision(currentPiece.value.shape, currentX.value, y + 1)) {
    y++
  }
  return y
})

const displayBoard = computed(() => {
  const display = board.value.map(row =>
    row.map(cell => cell.value > 0 ? cell.value : 0)
  )

  if (currentPiece.value && gameStatus.value === GAME_STATUS.PLAYING) {
    for (let y = 0; y < currentPiece.value.shape.length; y++) {
      for (let x = 0; x < currentPiece.value.shape[y].length; x++) {
        if (currentPiece.value.shape[y][x] > 0) {
          const boardY = ghostY.value + y
          const boardX = currentX.value + x
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            if (display[boardY][boardX] === 0) {
              display[boardY][boardX] = GHOST_VALUE
            }
          }
        }
      }
    }

    for (let y = 0; y < currentPiece.value.shape.length; y++) {
      for (let x = 0; x < currentPiece.value.shape[y].length; x++) {
        if (currentPiece.value.shape[y][x] > 0) {
          const boardY = currentY.value + y
          const boardX = currentX.value + x
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            display[boardY][boardX] = currentPiece.value.colorId
          }
        }
      }
    }
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

  for (let y = 0; y < nextPiece.value.shape.length; y++) {
    for (let x = 0; x < nextPiece.value.shape[y].length; x++) {
      if (nextPiece.value.shape[y][x] > 0) {
        result[y][x] = nextPiece.value.colorId
      }
    }
  }

  return result
})

const getCellColor = (colorId: number) => {
  if (colorId === GHOST_VALUE) return { backgroundColor: GHOST_BACKGROUND }

  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (board.value[y][x].colorId === colorId) {
        return { backgroundColor: board.value[y][x].color }
      }
    }
  }

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
  }, BASE_SPEED)
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

<style scoped>
.tetris-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #ffffff;
  margin-bottom: 30px;
}

.game-area {
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
}

.board {
  background-color: #000000;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.1);
}

.board-row {
  display: flex;
}

.board-cell {
  width: 30px;
  height: 30px;
  border: 1px solid #333333;
  background-color: #000000;
  transition: background-color 0.1s;
}

.board-cell.filled {
  background-color: #ff4444;
}

.board-cell.ghost {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px dashed #666666;
}

.info-panel {
  min-width: 150px;
  padding: 20px;
  background-color: #1a1a1a;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.next-piece {
  text-align: center;
  margin-bottom: 20px;
}

.next-board {
  background-color: #000000;
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
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

.controls {
  margin-top: 30px;
}

.control-row {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 10px 0;
}

.control-btn {
  width: 60px;
  height: 60px;
  font-size: 24px;
  border: none;
  border-radius: 8px;
  background-color: #444444;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.control-btn:hover:not(:disabled) {
  background-color: #666666;
}

.control-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.pause-btn,
.reset-btn {
  background-color: #444444;
}

.pause-btn:hover:not(:disabled),
.reset-btn:hover:not(:disabled) {
  background-color: #666666;
}

.navigation {
  margin-top: 30px;
  text-align: center;
  display: flex;
  gap: 15px;
  justify-content: center;
}

.nav-link {
  display: inline-block;
  margin: 0 10px;
  padding: 8px 16px;
  color: #ffffff;
  text-decoration: none;
  border: 1px solid #ffffff;
  border-radius: 4px;
  transition: all 0.3s;
}

.nav-link:hover {
  background-color: #ffffff;
  color: #000000;
}
</style>
