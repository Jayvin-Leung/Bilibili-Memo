<script setup>
import plugin from './plugin';
import config from './config';
import { click } from './main';

const handleChange = (_, e) => {
  e.preventDefault();
  click();
};
</script>

<template>
  <a-row justify="space-between" class="custom-row">
    <a-col :span="18" style="color: #a9a9a9">{{ plugin.description }}</a-col>
    <a-col class="custom-col-content">
      <a-switch :checked="config.base.isActive" @change="handleChange" />
    </a-col>
  </a-row>
</template>

<style scoped></style>
