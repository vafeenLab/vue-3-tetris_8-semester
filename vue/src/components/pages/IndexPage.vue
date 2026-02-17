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
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
