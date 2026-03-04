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
        </div>
    </div>
</template>

<script>
import {ref} from 'vue'

const mockShapes = ref([
  { id: 'base-1', name: 'I-образная', color: '#00FFFF' },
  { id: 'base-2', name: 'O-образная', color: '#FFFF00' },
  { id: 'base-3', name: 'T-образная', color: '#800080' }
])

const selectedId = ref('base-1')
const grid = ref([
  [0, 0, 0, 0],
  [1, 1, 1, 1],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
])
const currentName = ref('I-образная')
const currentColor = ref('#00FFFF')

const handleSelectChange = (e) => {
  const id = e.target.value
  selectedId.value = id
  const shape = mockShapes.value.find(s => s.id === id)
  if (shape) {
    currentName.value = shape.name
    currentColor.value = shape.color
    //shape for to be loaded...
  }
}

const toggleCell = (y, x) => {
  const newGrid = grid.value.map(row => [...row])
  newGrid[y][x] = newGrid[y][x] ? 0 : 1
  grid.value = newGrid
}

const handleNew = () => {
  selectedId.value = null
  currentName.value = ''
  currentColor.value = '#000000'
  grid.value = Array(4).fill(0).map(() => Array(4).fill(0))
}

const handleDelete = () => {
  if (!selectedId.value || selectedId.value.startsWith('base-')) {
    return
  }
  handleNew()
}

const handleSaveNew = () => {
  console.log('Сохранить как новую', { 
    name: currentName.value, 
    color: currentColor.value, 
    grid: grid.value 
})
}

const handleUpdate = () => {
  if (!selectedId.value) {
    return
  }
  console.log('Обновить фигуру', selectedId.value, { 
    name: currentName.value, 
    color: currentColor.value, 
    grid: grid.value 
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
    appearance: none;
    width: 100%;
    background-color: #2a2a2a;
    color: #ffffff;
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
    display: inline-block;
    margin: 20px 0;
    background-color: #000000;
    padding: 10px;
    border-radius: 12px;
  }

  &__grid-row {
    display: flex;
  }

  &__grid-cell {
    width: 40px;
    height: 40px;
    border: 1px solid #333;
    background-color: #1a1a1a;
    transition: background-color 0.1s;
    cursor: pointer;

    &:hover {
      background-color: #2a2a2a;
    }

    &_filled {
      background-color: #ffaa00; //stubbed-color
    }
  }

  &__params {
    margin: 20px 0;
    display: flex;
    gap: 20px;
    align-items: center;
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
    justify-content: flex-end;
    margin-top: 20px;
  }
}
</style>