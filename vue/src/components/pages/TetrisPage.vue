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
          @difficulty-changed="(val) => actions.changeDifficulty(val)"
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
      <RouterLink
        :to="{ name: $routes.EDITOR }"
        class="tetris-page__nav-link"
      >Редактор фигур
      </RouterLink>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import InfoPanel from '../ui/InfoPanel.vue'
import Controls from '../ui/Controls.vue'
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  GHOST_VALUE,
  NEXT_PIECE_SIZE,
  GHOST_BACKGROUND,
  ERROR_COLOR,
  GAME_STATUS,
  DIFFICULTY,
  BASE_SPEEDS
} from '@/constants/constants'

export default {
  name: 'TetrisPage',
  components: {
    InfoPanel,
    Controls
  },
  data () {
    return {
      board: [],
      currentPiece: null,
      nextPiece: null,
      currentX: 0,
      currentY: 0,
      linesCleared: 0,
      gameStatus: GAME_STATUS.IDLE,
      difficulty: DIFFICULTY.MEDIUM,
      gameInterval: null,
      GAME_STATUS,
      DIFFICULTY,
      GHOST_VALUE,
      GHOST_BACKGROUND,
      ERROR_COLOR,
      BASE_SPEEDS
    }
  },
  computed: {
    ...mapGetters('shapes', {
      allShapes: 'getAllShapes'
    }),

    actions () {
      return {
        movePieceLeft: () => this.movePieceLeft(),
        movePieceRight: () => this.movePieceRight(),
        rotateCurrentPiece: () => this.rotateCurrentPiece(),
        hardDropPiece: () => this.hardDropPiece(),
        toggleGamePause: () => this.toggleGamePause(),
        resetGame: () => this.resetGame()
      }
    },

    ghostY () {
      if (!this.currentPiece || this.gameStatus !== GAME_STATUS.PLAYING) {
        return this.currentY
      }
      let y = this.currentY
      while (!this.collision(this.currentPiece.shape, this.currentX, y + 1)) {
        y++
      }
      return y
    },

    displayBoard () {
      const display = this.board.map(row => row.map(
        cell => (cell.value > 0 ? cell.value : 0)
      ))

      if (this.currentPiece && this.gameStatus === GAME_STATUS.PLAYING) {
        const piece = this.currentPiece
        const ghostYVal = this.ghostY
        const curX = this.currentX
        const curY = this.currentY

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
              if (boardY >= 0 
                && boardY < BOARD_HEIGHT 
                && boardX >= 0 
                && boardX < BOARD_WIDTH) {
                display[boardY][boardX] = piece.colorId
              }
            }
          })
        })
      }

      return display
    },

    nextPieceBoard () {
      if (!this.nextPiece) {
        return Array(NEXT_PIECE_SIZE)
          .fill(0)
          .map(() => Array(NEXT_PIECE_SIZE).fill(0))
      }

      const result = Array(NEXT_PIECE_SIZE)
        .fill(0)
        .map(() => Array(NEXT_PIECE_SIZE).fill(0))

      this.nextPiece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell > 0) {
            result[y][x] = this.nextPiece.colorId
          }
        })
      })

      return result
    },
    
    baseInterval () {
      return BASE_SPEEDS[this.difficulty]
    },

    currentInterval () {
      const factor = 1 + this.linesCleared * 0.01
      return Math.max(this.baseInterval / factor, 50)
    }
  },
  methods: {
    extractNumber (id) {
      if (!id) {
        return null
      }
      const num = parseInt(id.replace(/\D/g, ''))
      return isNaN(num) ? null : num
    },

    createPiece (shapeData) {
      return {
        shape: shapeData.shape.map(row => [...row]),
        color: shapeData.color,
        colorId: this.extractNumber(shapeData.id) ?? Math.floor(Math.random() * 1000000),
        id: shapeData.id
      }
    },

    getRandomPiece () {
      const shapes = this.allShapes
      const randomIndex = Math.floor(Math.random() * shapes.length)
      return this.createPiece(shapes[randomIndex])
    },

    collision (shape, offsetX, offsetY) {
      return shape.some((row, y) =>
        row.some((cell, x) => {
          if (cell === 0) {
            return false
          }
          const boardX = offsetX + x
          const boardY = offsetY + y
          if (boardX < 0 
          || boardX >= BOARD_WIDTH 
          || boardY >= BOARD_HEIGHT) {
            return true
          }
          if (boardY >= 0 
          && this.board[boardY]?.[boardX]?.value !== 0) {
            return true
          }
          return false
        })
      )
    },

    initBoard () {
      this.board = Array(BOARD_HEIGHT)
        .fill(0)
        .map(() =>
          Array(BOARD_WIDTH)
            .fill(0)
            .map(() => ({
              value: 0,
              color: null,
              colorId: null
            }))
        )
    },

    setNextPiece (piece) {
      this.nextPiece = piece
    },

    setCurrentPiece (piece) {
      this.currentPiece = piece
    },

    setCurrentPosition (x, y) {
      this.currentX = x
      this.currentY = y
    },

    setGameStatus (status) {
      this.gameStatus = status
    },

    addLines (lines) {
      this.linesCleared += lines
      this.startGameLoop()
    },

    resetLines () {
      this.linesCleared = 0
    },

    mergePieceToBoard () {
      if (!this.currentPiece) {
        return
      }
      const piece = this.currentPiece
      const posX = this.currentX
      const posY = this.currentY
      piece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell !== 0) {
            const boardY = posY + y
            const boardX = posX + x
            if (
              boardY >= 0 &&
              boardY < BOARD_HEIGHT &&
              boardX >= 0 &&
              boardX < BOARD_WIDTH &&
              this.board[boardY][boardX].value === 0
            ) {
              this.board[boardY][boardX] = {
                value: piece.colorId,
                color: piece.color,
                colorId: piece.colorId
              }
            }
          }
        })
      })
    },

    removeFullLines () {
      let linesRemoved = 0
      let y = BOARD_HEIGHT - 1
      while (y >= 0) {
        if (this.board[y].every(cell => cell.value !== 0)) {
          this.board.splice(y, 1)
          this.board.unshift(
            Array(BOARD_WIDTH)
              .fill(0)
              .map(() => ({ value: 0, color: null, colorId: null }))
          )
          linesRemoved++
        } else {
          y--
        }
      }
      if (linesRemoved > 0) {
        this.addLines(linesRemoved)
      }
    },

    spawnNewPiece () {
      if (!this.nextPiece) {
        this.setNextPiece(this.getRandomPiece())
      }

      this.setCurrentPiece(JSON.parse(JSON.stringify(this.nextPiece)))
      this.setNextPiece(this.getRandomPiece())

      const newX = Math.floor((BOARD_WIDTH - (this.currentPiece?.shape[0].length || 0)) / 2)
      this.setCurrentPosition(newX, 0)

      if (this.currentPiece
        && this.collision(this.currentPiece.shape, this.currentX, this.currentY)) {
        this.setGameStatus(GAME_STATUS.GAME_OVER)
        if (this.gameInterval) {
          clearInterval(this.gameInterval)
          this.gameInterval = null
        }
      }
    },

    initGame () {
      this.initBoard()
      this.setNextPiece(this.getRandomPiece())
      this.spawnNewPiece()
      this.resetLines()
      this.setGameStatus(GAME_STATUS.IDLE)
    },

    movePieceLeft () {
      if (!this.currentPiece || this.gameStatus !== GAME_STATUS.PLAYING) {
        return
      }
      if (!this.collision(this.currentPiece.shape, this.currentX - 1, this.currentY)) {
        this.setCurrentPosition(this.currentX - 1, this.currentY)
      }
    },

    movePieceRight () {
      if (!this.currentPiece || this.gameStatus !== GAME_STATUS.PLAYING) return
      if (!this.collision(this.currentPiece.shape, this.currentX + 1, this.currentY)) {
        this.setCurrentPosition(this.currentX + 1, this.currentY)
      }
    },

    rotateCurrentPiece () {
      if (!this.currentPiece || this.gameStatus !== GAME_STATUS.PLAYING) {
        return
      }

      const rotated = this.currentPiece.shape[0].map((_, index) =>
        this.currentPiece.shape.map(row => row[index]).reverse()
      )

      if (!this.collision(rotated, this.currentX, this.currentY)) {
        this.setCurrentPiece({
          ...this.currentPiece,
          shape: rotated
        })
      } else {
        if (!this.collision(rotated, this.currentX - 1, this.currentY)) {
          this.setCurrentPiece({
            ...this.currentPiece,
            shape: rotated
          })
          this.setCurrentPosition(this.currentX - 1, this.currentY)
        } else if (!this.collision(rotated, this.currentX + 1, this.currentY)) {
          this.setCurrentPiece({
            ...this.currentPiece,
            shape: rotated
          })
          this.setCurrentPosition(this.currentX + 1, this.currentY)
        }
      }
    },

    movePieceDown () {
      if (!this.currentPiece || this.gameStatus !== GAME_STATUS.PLAYING) {
        return
      }

      if (!this.collision(this.currentPiece.shape, this.currentX, this.currentY + 1)) {
        this.setCurrentPosition(this.currentX, this.currentY + 1)
      } else {
        this.mergePieceToBoard()
        this.removeFullLines()
        this.spawnNewPiece()
      }
    },

    hardDropPiece () {
      if (!this.currentPiece || this.gameStatus !== GAME_STATUS.PLAYING) {
        return
      }

      let y = this.currentY
      while (!this.collision(this.currentPiece.shape, this.currentX, y + 1)) {
        y++
      }
      this.setCurrentPosition(this.currentX, y)
      this.mergePieceToBoard()
      this.removeFullLines()
      this.spawnNewPiece()
    },

    toggleGamePause () {
      if (this.gameStatus === GAME_STATUS.PLAYING) {
        this.setGameStatus(GAME_STATUS.PAUSED)
        if (this.gameInterval) {
          clearInterval(this.gameInterval)
          this.gameInterval = null
        }
      } else if (this.gameStatus === GAME_STATUS.PAUSED) {
        this.setGameStatus(GAME_STATUS.PLAYING)
        this.startGameLoop()
      } else if (this.gameStatus === GAME_STATUS.IDLE) {
        this.setGameStatus(GAME_STATUS.PLAYING)
        this.startGameLoop()
      } else if (this.gameStatus === GAME_STATUS.GAME_OVER) {
        this.initGame()
        this.setGameStatus(GAME_STATUS.PLAYING)
        this.startGameLoop()
      }
    },

    changeDifficulty (newDifficulty) {
      this.difficulty = newDifficulty
      this.startGameLoop()
    },

    resetGame () {
      if (this.gameInterval) {
        clearInterval(this.gameInterval)
        this.gameInterval = null
      }
      this.initGame()
    },

    startGameLoop () {
      if (this.gameInterval) {
        clearInterval(this.gameInterval)
      }

      this.gameInterval = setInterval(() => {
        if (this.gameStatus === GAME_STATUS.PLAYING) {
          this.movePieceDown()
        }
      }, this.currentInterval)
    },

    getCellColor (colorId) {
      if (colorId === GHOST_VALUE) {
        return { backgroundColor: GHOST_BACKGROUND }
      }

      const cell = this.board.flat().find(c => c.colorId === colorId)
      if (cell) {
        return { backgroundColor: cell.color }
      }

      if (this.currentPiece?.colorId === colorId) {
        return { backgroundColor: this.currentPiece.color }
      }
      if (this.nextPiece?.colorId === colorId) {
        return { backgroundColor: this.nextPiece.color }
      }

      return { backgroundColor: ERROR_COLOR }
    }
  },
  mounted () {
    this.initGame()
  },
  beforeUnmount () {
    if (this.gameInterval) {
      clearInterval(this.gameInterval)
      this.gameInterval = null
    }
  }
}
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
