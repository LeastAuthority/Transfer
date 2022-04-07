<template>
  <div class="version">
    <ion-text color="dark-grey">
      {{ version }}
    </ion-text>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { IonText } from '@ionic/vue';
import version from '@/version';

export default defineComponent({
  name: 'Version',
  components: {
    IonText,
  },
  setup() {
    return {
      version,
    };
  },
});
</script>

<style lang="css" scoped>
.version {
  position: absolute;
  bottom: 0;
  right: 0;
  margin-right: var(--md-margin);
  margin-bottom: var(--sm-margin);
  padding: var(--ion-padding);
  background: rgba(255, 255, 255, 0.6);
  z-index: 2000;
}
</style>
