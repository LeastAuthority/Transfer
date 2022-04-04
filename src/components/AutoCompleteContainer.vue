<script setup lang="ts">
import { useStore } from 'vuex';
import AutoComplete from './AutoComplete.vue';

const store = useStore();
</script>

<template>
  <AutoComplete :suggestedWord="store.state.suggestedWord" />
</template>
