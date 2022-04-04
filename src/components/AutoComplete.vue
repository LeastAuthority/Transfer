<script setup lang="ts">
import { IonCard, IonCardContent, IonText } from '@ionic/vue';
import { defineProps } from 'vue';

const props = defineProps(['suggestedWord']);
</script>

<style scoped>
.container {
  position: absolute;
  margin: 0 auto !important;
  left: 0;
  right: 0;

  transition: opacity 250ms ease;
}

.tab {
  position: relative;
  margin: 0 0 0 10px !important;
}
</style>

<template>
  <ion-card class="container no-pointer-events">
    <ion-card-content
      class="ion-padding flex ion-justify-content-center ion-align-items-center"
    >
      <ion-text color="black">{{ props.suggestedWord }}</ion-text>
      <ion-card color="light-grey" class="tab">
        <ion-card-content>
          <ion-text color="darker-grey" class="ion-text-nowrap"
            >Press space to complete</ion-text
          >
        </ion-card-content>
      </ion-card>
    </ion-card-content>
  </ion-card>
</template>
