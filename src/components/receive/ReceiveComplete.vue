<template>
  <Card :active="active">
    <template #title>
      <ion-text color="dark-grey" class="bold"> Received! </ion-text>
    </template>
    <template #content>
      <ion-grid>
        <ion-row class="ion-justify-content-center ion-margin-bottom">
          <FileCard :name="fileMeta.name" :size="fileMeta.size"></FileCard>
        </ion-row>
        <ion-row class="ion-margin-bottom">
          <ion-col>
            <ion-text class="ion-text-center">
              <h1 class="party-popper">
                &#x1f389;
                <!-- party popper -->
              </h1>
            </ion-text>
          </ion-col>
        </ion-row>
        <ion-row class="ion-margin-bottom">
          <ion-col class="ion-text-center">
            <ion-button color="blue" @click="next">
              <ion-icon
                slot="start"
                src="/assets/icon/receive-more.svg"
              ></ion-icon>
              <ion-text slot="end">Receive more</ion-text>
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </template>
  </Card>
</template>

<script lang="ts">
import {
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonButton,
  IonIcon,
} from '@ionic/vue';
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import { downloadOutline, sendSharp } from 'ionicons/icons';

import Card from '@/components/Card.vue';
import FileCard from '@/components/FileCard.vue';

export default defineComponent({
  name: 'ReceiveComplete',
  props: ['active', 'next'],
  computed: {
    ...mapState(['fileMeta']),
  },
  components: {
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonIcon,
    IonButton,
    Card,
    FileCard,
  },
  setup() {
    return {
      downloadOutline,
      sendSharp,
    };
  },
});
</script>

<style scoped></style>
