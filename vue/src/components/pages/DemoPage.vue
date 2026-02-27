<template>
  <div>
    <h1>{{ TEXTS.TITLE }}</h1>

    <div>
      <label for="inputField">{{ TEXTS.INPUT_LABEL }}</label>
      <input id="inputField" v-model="inputText" type="text" :placeholder="TEXTS.INPUT_PLACEHOLDER"
        class="demo-input" @keyup.enter="() => actions.printText()">
    </div>

    <div class="input-group">
      <label for="outputField">{{ TEXTS.OUTPUT_LABEL }}</label>
      <textarea
        id="outputField"
        v-model="outputText"
        readonly
        :placeholder="TEXTS.OUTPUT_PLACEHOLDER"
        class="demo-textarea"
        rows="1"
        ></textarea>
    </div>

    <button @click="() => actions.printText()" class="demo-button" :disabled="!inputText.trim()">
      {{ TEXTS.BUTTON_TEXT }}
    </button>

    <div class="navigation">
      <RouterLink :to="{ name: $routes.INDEX }" class="nav-link">
        {{ TEXTS.HOME_LINK }}
      </RouterLink>
      <RouterLink :to="{ name: $routes.EXAMPLE }" class="nav-link">
        {{ TEXTS.EXAMPLE_LINK }}
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const inputText = ref('')
const outputText = ref('')
const TEXTS = {
  TITLE: 'Демо страница',
  INPUT_LABEL: 'Введите текст:',
  INPUT_PLACEHOLDER: 'Напишите что-нибудь...',
  OUTPUT_LABEL: 'Вывод:',
  OUTPUT_PLACEHOLDER: 'Здесь появится ваш текст...',
  BUTTON_TEXT: 'Показать текст',
  HOME_LINK: 'На главную',
  EXAMPLE_LINK: 'На Example',
} as const


const actions = {
  printText: () => {
    if (inputText.value.trim()) {
      outputText.value = inputText.value
    }
  }
}
</script>

<style scoped lang="scss">
.demo-container {
  max-width: 500px;
  margin: 20px auto;
  padding: 0 10px;
}

h1 {
  color: #000000;
  text-align: center;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 500;
}

.input-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #000000;
  font-size: 14px;
}

.demo-input {
  width: 100%;
  padding: 6px;
  border: 1px solid #000000;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  color: #000000;
  background-color: #ffffff;

  &:focus {
    outline: none;
    border-color: #000000;
  }

  &::placeholder {
    color: #666666;
  }
}

.demo-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #000000;
  border-radius: 4px;
  font-size: 16px;
  background-color: #f5f5f5;
  resize: vertical;
  font-family: inherit;
  box-sizing: border-box;
  color: #000000;

  &:focus {
    outline: none;
    border-color: #000000;
  }

  &::placeholder {
    color: #666666;
  }
}
</style>