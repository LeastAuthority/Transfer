<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{ title }}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    {{ content }}
  </ion-content>
</template>

<script>
import {defineComponent} from 'vue';
import {
  IonHeader,
  IonTitle,
  IonToolbar,
  IonContent
} from '@ionic/vue';

export default defineComponent({
  name: "UnsupportedModal",
  props: [
    'title',
    'content',
  ],
  components: {
    IonHeader,
    IonTitle,
    IonToolbar,
    IonContent
  }
})
</script>

<style scoped>

</style>