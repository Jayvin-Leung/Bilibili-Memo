<script setup>
const props = defineProps({
  tags: {
    type: String,
    required: true,
    default: '',
  },
  color: {
    type: String,
    default: 'red',
  },
});
</script>

<template>
  <template v-for="tag in tags ? tags.split(',') : []" :key="tag">
    <a-tooltip v-if="tag.length > 20" :title="tag">
      <a-tag :color="color">
        {{ `${tag.slice(0, 20)}...` }}
      </a-tag>
    </a-tooltip>
    <a-tag v-else :color="color">
      {{ tag }}
    </a-tag>
  </template>
</template>

<style scoped></style>
