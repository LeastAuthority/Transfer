<template>
  <div class="relative">
    <ReceiveDefault
      :active="onStep(ReceiveStep.Default)"
      :next="nextFrom(ReceiveStep.Default)"
      :reset="goToStep(ReceiveStep.Default)"
    ></ReceiveDefault>
    <ReceiveConsent
      :active="onStep(ReceiveStep.Consent)"
      :back="backFrom(ReceiveStep.Consent)"
      :next="nextFrom(ReceiveStep.Consent)"
      :reset="goToStep(ReceiveStep.Default)"
      :complete="nextFrom(ReceiveStep.Progress)"
    ></ReceiveConsent>

    <ReceiveProgress
      :active="onStep(ReceiveStep.Progress)"
      :back="goToStep(ReceiveStep.Default)"
    ></ReceiveProgress>

    <ReceiveComplete
      :active="onStep(ReceiveStep.Complete)"
      :next="nextFrom(ReceiveStep.Complete)"
    ></ReceiveComplete>
  </div>
</template>

<style lang="css" scoped></style>

<script lang="ts">
import ReceiveComplete from '@/components/receive/ReceiveComplete.vue';
import ReceiveConsent from '@/components/receive/ReceiveConsent.vue';
import ReceiveDefault from '@/components/receive/ReceiveDefault.vue';
import ReceiveProgress from '@/components/receive/ReceiveProgress.vue';
import {
  ALERT_MATCHED_ERROR,
  RESET_PROGRESS,
  SAVE_FILE,
  SET_FILE_META,
} from '@/store/actions';
import { ReceiveStep } from '@/types';
import { defineComponent } from 'vue';
import { mapActions, mapMutations, mapState } from 'vuex';

export default defineComponent({
  name: 'Receive',
  async beforeUpdate() {
    if (typeof this.$route.query.hasCode !== 'undefined') {
      await this.$router.replace('/r');
      this.step = ReceiveStep.Consent;
      try {
        await this[SAVE_FILE](this.code);
      } catch (error) {
        console.error(error);
        this.step = ReceiveStep.Default;
      }
    }
  },
  data() {
    return {
      step: ReceiveStep.Default,
    };
  },
  computed: {
    ...mapState(['code']),
  },
  methods: {
    ...mapActions([SAVE_FILE, ALERT_MATCHED_ERROR]),
    ...mapMutations([SET_FILE_META, RESET_PROGRESS]),
    onStep(step: ReceiveStep): boolean {
      return this.step === step;
    },
    stepForward(): void {
      if (this.step < ReceiveStep.Complete) {
        this.step++;
      } else {
        this.step = ReceiveStep.Default;
        this[RESET_PROGRESS]();
        this[SET_FILE_META]({ name: '', size: 0 });
      }
    },
    stepBack(): void {
      if (this.step > ReceiveStep.Default) {
        this.step--;
      }
    },
    nextFrom(step: ReceiveStep): () => void {
      return (): void => {
        if (this.step === step) {
          this.stepForward();
        }
      };
    },
    backFrom(step: ReceiveStep): () => void {
      return (): void => {
        if (this.step === step) {
          this.stepBack();
        }
      };
    },
    goToStep(step: ReceiveStep): () => void {
      return (): void => {
        this.step = step;
      };
    },
  },
  components: {
    ReceiveDefault,
    ReceiveConsent,
    ReceiveProgress,
    ReceiveComplete,
  },
  setup() {
    return {
      ReceiveStep,
    };
  },
});
</script>
