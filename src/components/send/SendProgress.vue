<template>
  <Progress
    :active="active"
    progress-msg="Waiting for receiver to complete transfer..."
  >
    <template #title> Sending... </template>
    <template #grid>
      <ion-row class="ion-justify-content-center">
        <FileCard :name="fileMeta.name" :size="fileMeta.size"></FileCard>
      </ion-row>
    </template>
  </Progress>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters, mapMutations, mapState } from 'vuex';

import { RESET_PROGRESS } from '@/store/actions';
import Progress from '@/components/Progress.vue';
import FileCard from '@/components/FileCard.vue';

export default defineComponent({
  name: 'SendProgress.vue',
  props: ['active', 'back'],
  computed: {
    ...mapState(['fileMeta']),
    ...mapGetters(['progressETA']),
    _progressETA() {
      return (this.progressETA as unknown as string) !== ''
        ? this.progressETA
        : 'Waiting for receiver to complete transfer...';
    },
  },
  methods: {
    ...mapMutations([RESET_PROGRESS]),
    // TODO: lift up.
    cancel() {
      this.back();
      this[RESET_PROGRESS]();
    },
  },
  components: {
    Progress,
    FileCard,
  },
});
</script>

<style scoped></style>
