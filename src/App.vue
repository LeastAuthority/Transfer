<template>
  <ion-app>
    <Main id="content"></Main>
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet, IonMenu } from '@ionic/vue';
import { defineComponent } from 'vue';
import Main from '@/views/Main.vue';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    Main,
  },
});
</script>
