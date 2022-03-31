<script setup lang="ts">
import { ref } from 'vue';
import PopoverVue from '@/components/Popover.vue';
const button = ref<null | HTMLElement>(null);
const active = ref(false);

function handleClick() {
  active.value = true
}

function handleDismiss() {
  active.value = false
}
</script>

<template>
  <div>
    <PopoverVue :active="active" :elementRef="button" :onDismiss="handleDismiss">
      <h1>Popover content goes here</h1>
    </PopoverVue>
    <button ref="button" @click="handleClick">Trigger popover</button>
  </div>
</template>