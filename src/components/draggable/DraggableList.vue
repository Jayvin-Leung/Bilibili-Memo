<script setup>
const props = defineProps({
  list: {
    type: Array,
    required: true,
    default: [],
  },
});
const emits = defineEmits(['change']);

let dragIndex = 0;

const dragstart = (e, index) => {
  e.stopPropagation();
  setTimeout(() => {
    e.target.classList.add('moving');
  }, 0);
  dragIndex = index;
};
const dragover = (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
};
const dragenter = (e, index) => {
  e.preventDefault();
  if (dragIndex !== index) {
    const source = props.list[dragIndex];
    props.list.splice(dragIndex, 1);
    props.list.splice(index, 0, source);
    dragIndex = index;
  }
};
const dragend = (e) => {
  e.target.classList.remove('moving');
  emits('change', props.list);
};
</script>

<template>
  <ul class="items">
    <li
      v-for="(item, index) in props.list"
      :key="item.id"
      :draggable="true"
      @dragstart="dragstart($event, index)"
      @dragover="dragover"
      @dragenter="dragenter($event, index)"
      @dragend="dragend"
      class="item"
    >
      <slot v-if="$slots.item" name="item" v-bind="{ ...item, index }" />
      <span v-else>{{ item.text }}</span>
    </li>
  </ul>
</template>

<style scoped>
.items {
  width: 100%;
  padding: 0 10px;
  background: #efefef;
  border-radius: 4px;
}
.item {
  margin: 8px 0;
  background: #fff;
  border: 1px solid #dbdbdb;
  border-radius: 6px;
}
.moving {
  color: transparent;
  background: transparent;
  border: 1px dashed #ccc;
  transition: none;
}
</style>
