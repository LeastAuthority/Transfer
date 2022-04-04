<template>
  <Card :active="active">
    <template #title>
      <ion-text class="bold" color="dark-grey">
        <slot name="title"></slot>
      </ion-text>
    </template>
    <template #content>
      <ion-grid>
        <slot name="grid"></slot>
        <ion-row class="ion-justify-content-center ion-align-items-center">
          <ion-col>
            <ion-progress-bar
              color="progress-grey"
              :value="progress"
            ></ion-progress-bar>
          </ion-col>
        </ion-row>
        <ion-row class="ion-text-center">
          <ion-col>
            <ion-text color="dark-grey">
              {{ _progressETA }}
            </ion-text>
          </ion-col>
        </ion-row>
        <ion-row class="ion-text-center">
          <ion-col>
            <ion-button color="medium-grey" @click="cancel">
              <ion-icon slot="start" :icon="close"></ion-icon>
              <ion-label slot="end">Cancel</ion-label>
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </template>
  </Card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters, mapState } from 'vuex';
import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonLabel,
  IonProgressBar,
  IonRow,
  IonText,
} from '@ionic/vue';
import { close } from 'ionicons/icons';

import Card from '@/components/Card.vue';

export default defineComponent({
  name: 'Progress',
  props: ['active', 'cancel', 'progressMsg'],
  computed: {
    ...mapState(['progress', 'progressHung']),
    ...mapGetters(['progressETA']),
    _progressETA(): string {
      return (this.progressETA as unknown as string) !== ''
        ? this.progressETA
        : this.progressMsg;
    },
  },
  components: {
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonButton,
    IonLabel,
    IonIcon,
    IonProgressBar,
    Card,
  },
  setup() {
    return {
      close,
    };
  },
});
</script>

<style scoped></style>
