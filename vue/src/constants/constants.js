export const BOARD_WIDTH = 10
export const BOARD_HEIGHT = 22
//export const BASE_SPEED = 500
export const GHOST_VALUE = -1
export const NEXT_PIECE_SIZE = 4
export const MIN_HUE = 0
export const MAX_HUE = 360
export const MIN_SATURATION = 70
export const MAX_SATURATION = 30
export const MIN_LIGHTNESS = 50
export const MAX_LIGHTNESS = 20
export const MAX_COLOR_ID = 1000000
export const GHOST_BACKGROUND = 'rgba(255, 255, 255, 0.2)'
export const ERROR_COLOR = '#ff4444'

export const GAME_STATUS = {
  IDLE: 'idle',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver',
}

export const DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
}

export const BASE_SPEEDS = {
  [DIFFICULTY.EASY]: 600,
  [DIFFICULTY.MEDIUM]: 400,
  [DIFFICULTY.HARD]: 250
}

export const CONTROLS = {
  LEFT: '←',
  RIGHT: '→',
  ROTATE: '↻',
  DROP: '↓',
  PAUSE: '⏸',
  PLAY: '▶',
  RESET: '↺',
}

export const PIECE_SHAPES = [
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
]