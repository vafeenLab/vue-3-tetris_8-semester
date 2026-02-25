<template>
  <div class="tetris-container">
    <h1>Тетрис</h1>

    <div class="game-area">
      <!-- Игровое поле -->
      <div class="board">
        <div v-for="row in 20" :key="row" class="board-row">
          <div v-for="col in 10" :key="col" class="board-cell"></div>
        </div>
      </div>

      <!-- Информационная панель -->
      <div class="info-panel">
        <div class="next-piece">
          <h3>Следующая:</h3>
          <div class="next-board">
            <div v-for="row in 4" :key="row" class="board-row">
              <div v-for="col in 4" :key="col" class="board-cell small"></div>
            </div>
          </div>
        </div>

        <div class="lines">
          <h3>Линии:</h3>
          <div class="lines-value">0</div>
        </div>

        <div class="game-status">
          <h3>Игра идет</h3>
        </div>

        <!-- Кнопки управления -->
        <div class="controls">
          <div class="control-row">
            <button class="control-btn">←</button>
            <button class="control-btn">→</button>
          </div>
          <div class="control-row">
            <button class="control-btn">↻</button>
            <button class="control-btn">↓</button>
          </div>
          <div class="control-row">
            <button class="control-btn pause-btn">⏸</button>
            <button class="control-btn reset-btn">↺</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Навигация -->
    <div class="navigation">
      <a href="#" class="nav-link">На главную</a>
      <a href="#" class="nav-link">На Example</a>
      <a href="#" class="nav-link">На Demo</a>
    </div>
  </div>
</template>

<script setup lang="ts">
// TODO: Логика игры
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
