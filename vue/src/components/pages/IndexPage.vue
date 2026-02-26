<template>
  <div>
    Index

    <div>
      <RouterLink :to="{ name: $routes.EXAMPLE }">
        To Example
      </RouterLink>
      <RouterLink :to="{ name: $routes.DEMO }">
        To Demo
      </RouterLink>
      <RouterLink :to="{ name: $routes.TETRIS }">
        To Tetris
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
