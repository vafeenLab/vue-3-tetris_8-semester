<template>
  <div class="controls">
    <div class="control-row">
      <button
        @click="() => actions.movePieceLeft()"
        :disabled="gameStatus !== GAME_STATUS.PLAYING"
        class="control-btn"
      >
        {{ CONTROLS.LEFT }}
      </button>
      <button
        @click="() => actions.movePieceRight()"
        :disabled="gameStatus !== GAME_STATUS.PLAYING"
        class="control-btn"
      >
        {{ CONTROLS.RIGHT }}
      </button>
    </div>
    <div class="control-row">
      <button
        @click="() => actions.rotateCurrentPiece()"
        :disabled="gameStatus !== GAME_STATUS.PLAYING"
        class="control-btn"
      >
        {{ CONTROLS.ROTATE }}
      </button>
      <button
        @click="() => actions.hardDropPiece()"
        :disabled="gameStatus !== GAME_STATUS.PLAYING"
        class="control-btn"
      >
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
</template>

<script setup lang="ts">
import { CONTROLS, GAME_STATUS } from '../../constants/constants'

defineProps<{
  gameStatus: string
  actions: {
    movePieceLeft: () => void
    movePieceRight: () => void
    rotateCurrentPiece: () => void
    hardDropPiece: () => void
    toggleGamePause: () => void
    resetGame: () => void
  }
}>()
</script>

<style scoped lang="scss">
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
</style>