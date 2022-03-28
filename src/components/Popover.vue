<script setup lang="ts">
import { defineProps, onBeforeUnmount, onMounted, ref, toRef, watch } from 'vue'

const props = defineProps(['active', 'elementRef', 'onDismiss'])
const elementRef = toRef(props, 'elementRef')

const bounds: any = ref(null)

function handleResize() {
  if (elementRef.value) {
    bounds.value = elementRef.value.getBoundingClientRect();
  }
}

watch(() => props.active, () => {
  handleResize();
})

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.content {
  transition: visibility 0.2s, opacity 0.2s;
}
</style>

<template>
  <div>
    <Teleport to="body">
      <div
        class="content"
        :style="{ visibility: props.active ? 'visible' : 'hidden', opacity: props.active ? 1 : 0 }"
      >
        <div
          :style="{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }"
          @click="onDismiss"
        ></div>
        <div
          :style="{
            position: 'absolute',
            top: `${(bounds && bounds.bottom) || 0}px`,
            left: `${(bounds && bounds.left) || 0}px`,
            width: `${(bounds && bounds.width) || 0}px`,
            backgroundColor: 'white'
          }"
        >
          <slot></slot>
        </div>
      </div>
    </Teleport>
  </div>
</template>
