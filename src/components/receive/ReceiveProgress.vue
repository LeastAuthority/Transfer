<template>
  <Progress
    :active="active"
    :cancel="cancel"
    progress-msg="Waiting for receiver to complete transfer..."
  >
    <template #title>Receiving...</template>
    <template #grid>
      <ion-row>
        <ion-col class="flex ion-justify-content-center">
          <FileCard :name="fileMeta.name" :size="fileMeta.size"></FileCard>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col class="flex ion-justify-content-center">
          <ion-button color="yellow" disabled="true" @click="download">
            <ion-icon slot="start" src="/assets/icon/download.svg"></ion-icon>
            <ion-label slot="end">Download</ion-label>
          </ion-button>
        </ion-col>
      </ion-row>
    </template>
  </Progress>
</template>

<script lang="ts">
import { IonRow, IonCol, IonButton, IonIcon, IonLabel } from '@ionic/vue';
import { defineComponent } from 'vue';
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import {
  enterOutline,
  exitOutline,
  exit,
  cloudDownloadOutline,
  close,
} from 'ionicons/icons';

import router from '@/router/index.ts';
import { sizeToClosestUnit } from '@/util';
import { NEW_CLIENT, RESET_PROGRESS } from '@/store/actions';
import { FileMeta } from '@/store';
import FileCard from '@/components/FileCard.vue';
import Progress from '@/components/Progress.vue';

declare interface ReceiveProgressData {
  done?: Promise<void>;
}

export default defineComponent({
  name: 'ReceiveProgress',
  props: ['active', 'back', 'next'],
  data(): ReceiveProgressData {
    return {
      done: undefined,
    };
  },
  computed: {
    ...mapState(['config', 'code', 'fileMeta', 'progress', 'progressHung']),
    ...mapGetters(['progressETA']),
    fileSize(): string {
      // TODO: cleanup.
      const fileMeta = this.fileMeta as unknown as FileMeta;
      return sizeToClosestUnit(fileMeta.size);
    },
    // TODO: calculate!
  },
  methods: {
    ...mapActions([NEW_CLIENT]),
    ...mapMutations([RESET_PROGRESS]),
    cancel() {
      // TODO: move into action.
      // TODO: *use reject here.
      // this.back();
      // this[RESET_PROGRESS]();
      // this[NEW_CLIENT]();
      window.history.pushState({}, '', '/#/r');
      window.location.reload();
    },
  },
  components: {
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonLabel,
    FileCard,
    Progress,
  },
  setup() {
    return {
      cloudDownloadOutline,
      close,
      enterOutline,
      exit,
      exitOutline,
      router,
    };
  },
});
</script>

<style lang="css" scoped></style>
