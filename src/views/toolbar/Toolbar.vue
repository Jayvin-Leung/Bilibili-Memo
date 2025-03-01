<script setup>
import Menu from './menu/Button.vue';
import Nav from './nav/Button.vue';
</script>

<template>
  <Nav v-bind="$attrs" style="left: 24px; bottom: 80px" />
  <Menu v-bind="$attrs" style="left: 24px; bottom: 24px" />
</template>

<style scoped></style>
