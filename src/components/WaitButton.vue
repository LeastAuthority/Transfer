<template>
  <ion-button color="yellow" @click="_click" :disabled="_waiting || disabled">
    <slot v-if="_waiting" name="waiting-text"></slot>
    <slot v-else name="text"></slot>
  </ion-button>
</template>

<style scoped lang="css">
ion-button::part(native) {
  /*transition: background-color .3s ease;*/
  transition: background-color 0.5s ease;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';

import { IonButton } from '@ionic/vue';

export const DefaultDuration = 3000;

declare interface WaitButtonData {
  waiting: boolean;
}

export default defineComponent({
  name: 'WaitButton',
  props: ['text', 'waitingText', 'click', 'disabled', 'force', 'duration'],
  data(): WaitButtonData {
    return {
      waiting: false,
    };
  },
  computed: {
    _duration(): number {
      return this.duration || DefaultDuration;
    },
    _waiting(): boolean {
      return this.waiting || this.force;
    },
  },
  methods: {
    _click(): void {
      this.wait();
      this.click();
    },
    wait(): void {
      window.setTimeout(() => {
        this.waiting = false;
      }, this._duration);
      this.waiting = true;
    },
  },
  components: {
    IonButton,
  },
});
</script>
