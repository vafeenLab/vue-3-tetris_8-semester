<template>
      <div class="shape-editor">
        <h2 class="shape-editor__title">Редактор фигур</h2>
        <div class="shape-editor__list">
            <select
                class="shape-editor__select"
                :value="selectedId"
                @change="(e) => handleSelectChange(e)"
            >
                <option
                    v-for="shape in mockShape"
                    :key="shape.id"
                    :value="shape.id"
                >
                    {{ shape.name }}
                </option>
            </select>

            <button
                class="shape-editor__btn shape-editor__btn--new"
                @click="handleNew"
            >
                Новая
            </button>
            <button
                class="shape-editor__btn shape-editor__btn--delete"
                :disabled="!selectedId || selectedId.startsWith('base-')"
                @click="handleDelete"
            >
                Удалить
            </button>
        </div>
      </div>
           <div class="shape-editor__grid">
            <div
                v-for="(row, y) in grid"
                :key="y"
                class="shape-editor__grid-row"
            >
                <div
                    v-for="(cell, x) in row"
                    :key="x"
                    class="shape-editor__grid-cell"
                    :class="{ 'shape-editor__grid-cell_filled': cell === 1 }"
                    @click="() => toggleCell(y, x)"
                ></div>
            </div>

            <div class="shape-editor__params">
                <label class="shape-editor__label">
                    Название:
                    <input
                        v-model="currentName"
                        type="text"
                        class="shape-editor__input"
                    />
                </label>

                <label class="shape-editor__label">
                    Цвет:
                    <input
                        v-model="currentColor"
                        type="color"
                        class="shape-editor__color"
                    />
                </label>
            </div>

            <div class="shape-editor__actions">
                <button
                    class="shape-editor__btn shape-editor__btn--save-new"
                    @click="handleSaveNew"
                >
                    Сохранить как новую
                </button>

                <button
                    class="shape-editor__btn shape-editor__btn--update"
                    :disabled="!selectedId"
                    @click="handleUpdate"
                >
                    Обновить
                </button>
            </div>

    <div class="shape-editor__footer">
      <RouterLink :to="{ name: $routes.TETRIS }" class="shape-editor__back-btn">
        ← Вернуться в тетрис
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const allShapes = computed(() => store.getters['shapes/getAllShapes'] || [])

const selectedId = ref('base-1')
const grid = ref([])
const currentName = ref('')
const currentColor = ref('#00FFFF')

// Функция для получения фигуры по ID
const getShapeById = (id) => {
  const getter = store.getters['shapes/getShapeById']
  return getter ? getter(id) : null
}

// Загрузка фигуры при выборе
const loadShape = (id) => {
  if (!id) return
  
  const shape = getShapeById(id)
  if (shape) {
    currentName.value = shape.name || ''
    currentColor.value = shape.color || '#00FFFF'
    
    // Создаем копию фигуры с размером 4x4
    const size = 4
    const newGrid = Array(size).fill(0).map(() => Array(size).fill(0))
    
    if (shape.shape && Array.isArray(shape.shape)) {
      shape.shape.forEach((row, y) => {
        if (Array.isArray(row)) {
          row.forEach((cell, x) => {
            if (y < size && x < size) {
              newGrid[y][x] = cell
            }
          })
        }
      })
    }
    grid.value = newGrid
  }
}

// Следим за выбранной фигурой
watch(selectedId, (newId) => {
  loadShape(newId)
}, { immediate: true })

const handleSelectChange = (e) => {
  selectedId.value = e.target.value
}

const toggleCell = (y, x) => {
  const newGrid = grid.value.map(row => [...row])
  newGrid[y][x] = newGrid[y][x] ? 0 : 1
  grid.value = newGrid
}

const handleNew = () => {
  selectedId.value = null
  currentName.value = 'Новая фигура'
  currentColor.value = '#FFAA00'
  grid.value = Array(4).fill(0).map(() => Array(4).fill(0))
}

const handleDelete = () => {
  if (!selectedId.value || selectedId.value.startsWith('base-')) {
    return
  }
  store.dispatch('shapes/deleteShape', selectedId.value)
  selectedId.value = 'base-1'
}

const getCleanShape = () => {
  if (!grid.value || !grid.value.length) return [[1]]
  
  // Обрезаем пустые строки
  let shape = grid.value.filter(row => row.some(cell => cell === 1))
  
  if (shape.length === 0) {
    return [[1]]
  }
  
  // Обрезаем пустые колонки
  const cols = shape[0].length
  let minCol = cols
  let maxCol = 0
  
  shape.forEach(row => {
    row.forEach((cell, x) => {
      if (cell === 1) {
        minCol = Math.min(minCol, x)
        maxCol = Math.max(maxCol, x)
      }
    })
  })
  
  if (maxCol >= minCol) {
    shape = shape.map(row => row.slice(minCol, maxCol + 1))
  }
  
  return shape
}

const handleSaveNew = () => {
  const newShape = {
    id: 'custom-' + Date.now(),
    name: currentName.value || 'Новая фигура',
    color: currentColor.value,
    shape: getCleanShape()
  }
  
  store.dispatch('shapes/addShape', newShape)
  selectedId.value = newShape.id
}

const handleUpdate = () => {
  if (!selectedId.value || selectedId.value.startsWith('base-')) {
    return
  }
  
  store.dispatch('shapes/updateShape', {
    id: selectedId.value,
    name: currentName.value,
    color: currentColor.value,
    shape: getCleanShape()
  })
}
</script>

<style scoped lang="scss">
.shape-editor {
  max-width: 500px;
  margin: 0 auto;
  padding: 24px;
  background-color: #1e1e1e;
  border-radius: 16px;
  color: #ffffff;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);

  &__title {
    text-align: center;
    margin: 0 0 24px 0;
    font-size: 1.8rem;
    font-weight: 300;
    letter-spacing: 1px;
    color: #ffaa00;
  }

  &__list {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
    align-items: center;
  }

  &__select {
    flex: 1;
    padding: 8px 12px;
    background-color: #2a2a2a;
    color: #ffffff;
    border: 1px solid #444;
    border-radius: 6px;
    cursor: pointer;
    text-align: center;

    option {
      background-color: #2a2a2a;
    }
  }

  &__btn {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    background-color: #3a3a3a;
    color: #ffffff;

    &:hover:not(:disabled) {
      background-color: #4a4a4a;
      transform: translateY(-1px);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    &--new {
      background-color: #2a6f97;

      &:hover:not(:disabled) {
        background-color: #1e5a7a;
      }
    }

    &--delete {
      background-color: #a13d3d;

      &:hover:not(:disabled) {
        background-color: #7a2e2e;
      }
    }

    &--save-new {
      background-color: #2a6f97;
    }

    &--update {
      background-color: #5a3d7a;

      &:hover:not(:disabled) {
        background-color: #452e5a;
      }
    }
  }

  &__grid {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px 0;
  }

  &__grid-container {
    display: inline-block;
    background-color: #000000;
    padding: 10px;
    border-radius: 12px;
  }

  &__grid-row {
    display: flex;
    justify-content: center;
  }

  &__grid-cell {
    width: 40px;
    height: 40px;
    border: 1px solid #333;
    background-color: #1a1a1a;
    transition: all 0.1s;
    cursor: pointer;

    &:hover {
      background-color: #2a2a2a;
    }

    &_filled {
      background-color: currentColor;
    }
  }

  &__params {
    margin: 20px 0;
    display: flex;
    gap: 20px;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
  }

  &__label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #cccccc;
    font-size: 0.9rem;
  }

  &__input {
    background-color: #2a2a2a;
    border: 1px solid #444;
    border-radius: 4px;
    color: #ffffff;
    padding: 6px 10px;
    font-size: 0.9rem;

    &:focus {
      outline: none;
      border-color: #ffaa00;
    }
  }

  &__color {
    width: 40px;
    height: 30px;
    border: 1px solid #444;
    border-radius: 4px;
    background-color: transparent;
    cursor: pointer;
  }

  &__actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 20px;
  }

  &__footer {
    margin-top: 30px;
    text-align: center;
    border-top: 1px solid #333;
    padding-top: 20px;
  }

  &__back-btn {
    display: inline-block;
    padding: 10px 24px;
    background-color: #4a4a4a;
    color: #ffffff;
    text-decoration: none;
    border-radius: 6px;
    font-size: 1rem;
    transition: all 0.2s;
    border: 1px solid #666;

    &:hover {
      background-color: #5a5a5a;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }
  }
}
</style>
