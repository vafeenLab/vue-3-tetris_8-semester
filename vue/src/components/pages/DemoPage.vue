<template>
  <div>
    <h1>Демо страница</h1>

    <div>
      <label for="inputField">Введите текст:</label>
      <input 
        id="inputField"
        v-model="inputText" 
        type="text" 
        placeholder="Напишите что-нибудь..."
        class="demo-input"
      >
    </div>

    <div class="input-group">
      <label for="outputField">Вывод:</label>
      <textarea 
        id="outputField"
        v-model="inputText" 
        readonly
        placeholder="Здесь появится ваш текст..."
        class="demo-textarea"
        rows="1"
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const inputText = ref('')
</script>

<style scoped>
.demo-container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 0 1rem;
}

h1 {
  color: #000000;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  font-weight: 500;
}

.input-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #000000;
  font-size: 0.9rem;
}

.demo-input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #000000;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  color: #000000;
  background-color: #ffffff;
}

.demo-input:focus {
  outline: none;
  border-color: #000000;
}

.demo-input::placeholder {
  color: #666666;
}

.demo-textarea {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #000000;
  border-radius: 4px;
  font-size: 1rem;
  background-color: #f5f5f5;
  resize: vertical;
  font-family: inherit;
  box-sizing: border-box;
  color: #000000;
}

.demo-textarea:focus {
  outline: none;
  border-color: #000000;
}

.demo-textarea::placeholder {
  color: #666666;
}
</style>