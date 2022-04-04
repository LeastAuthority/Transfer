<template>
  <div
    class="flex-col drag-n-drop ion-justify-content-center"
    :style="{
      borderStyle: showDragElements ? 'solid' : 'dashed',
    }"
    @drop="drop"
    @dragover="(event) => event.preventDefault()"
    @dragenter="dragEnter"
  >
    <div
      id="drag-backdrop"
      class="relative"
      :style="{
        opacity: showDragElements ? 1 : 0,
        ['pointer-events']: showDragElements ? 'all' : 'none',
      }"
      @drop="drop"
      @dragover="dragOver"
      @dragleave="dragLeave"
    >
      <div
        id="drag-content"
        class="no-pointer-events flex ion-justify-content-center ion-align-items-center"
      >
        <ion-text color="black">
          <h1>Drop here! &#x1F60E;</h1>
        </ion-text>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonText } from '@ionic/vue';
import { mapMutations, mapState } from 'vuex';
import { HIDE_DRAG_ELEMENTS, SHOW_DRAG_ELEMENTS } from '@/store/actions';

export default defineComponent({
  name: 'DropZone',
  props: ['select'],
  computed: {
    ...mapState(['showDragElements']),
  },
  methods: {
    ...mapMutations([HIDE_DRAG_ELEMENTS, SHOW_DRAG_ELEMENTS]),
    drop(event: DragEvent) {
      event.preventDefault();
      this[HIDE_DRAG_ELEMENTS]();

      const files = event.dataTransfer!.files;
      if (files.length > 0) {
        // NB: only dropping first file in list.
        this.select(files[0]);
      } else {
        console.error('no files listed in drop event');
      }
    },
    dragEnter(event: DragEvent): void {
      event.preventDefault();
      this[SHOW_DRAG_ELEMENTS]();
    },
    dragOver(event: DragEvent) {
      event.preventDefault();
    },
    dragLeave(event: DragEvent): void {
      event.preventDefault();
      this[HIDE_DRAG_ELEMENTS]();
    },
  },
  components: {
    IonText,
  },
});
</script>

<style scoped lang="css">
ion-icon {
  width: 50px;
  height: 50px;
}

h1 {
  font-size: 40px;
}

.drag-n-drop {
  overflow: hidden;
  min-height: calc(93vh - 19.8rem);
  position: relative;
  align-items: center;
  border: 4px dashed #858789;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.05);
}

#drag-content {
  width: 100%;
  height: 100%;
  white-space: nowrap;
}

#drag-backdrop {
  position: absolute;
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transition: opacity 100ms;
  z-index: 99;
  background: var(--ion-color-tertiary);
}
</style>
