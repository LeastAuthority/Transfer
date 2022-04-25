<script setup lang="ts">
import CardVue from '@/components/Card.vue';
import { ErrInvalidCode } from '@/errors';
import { SAVE_FILE, SET_CODE } from '@/store/actions';
import { CODE_REGEX } from '@/util';
import { CodeCompleter } from '@/wordlist/wordlist';
import {
  IonCol,
  IonGrid,
  IonInput,
  IonRow,
  IonSpinner,
  IonText,
} from '@ionic/vue';
import { computed, defineProps, ref, watch } from 'vue';
import { useStore } from 'vuex';
import AutoComplete from '../AutoComplete.vue';
import PopoverVue from '../Popover.vue';
import WaitButtonVue, { DefaultDuration } from '../WaitButton.vue';

const completer = new CodeCompleter();

const errorColor = 'warning-red';
const exampleColor = 'dark-grey';
const errorText = ErrInvalidCode.message;
const exampleText = 'E.g.: 7-guitarist-revenge';

const props = defineProps(['active', 'next', 'reset']);

const store = useStore();

const exampleErrorColor = ref(exampleColor);
const exampleErrorText = ref(exampleText);
const waiting = ref(false);
const codeInput = ref(null);
const codeInputInner = ref(null);
const active = ref(false);
const modelCode = ref('');
const suggestedWord = ref<string | null>(null);

function autoComplete(inputValue: string, suggestion: string): string {
  const split = inputValue.split('-');
  split.pop();
  const result = [...split, suggestion].join('-');
  return split.length < 2 ? result + '-' : result;
}

function getSuggestion(inputValue: string): string | null {
  return completer.nearestNextWord(inputValue) || null;
}

watch(suggestedWord, () => {
  active.value = suggestedWord.value !== null;
});

watch(codeInput, async (r: any) => {
  const ionInputEl = r.$el;
  codeInputInner.value = await ionInputEl.getInputElement();
});

watch(modelCode, (value) => {
  if (value.includes(' ')) {
    if (suggestedWord.value) {
      modelCode.value = autoComplete(value, suggestedWord.value);
      suggestedWord.value = null;
    } else {
      modelCode.value = value
        .split('')
        .filter((x) => x !== ' ')
        .join('');
    }
  }
  suggestedWord.value = getSuggestion(value);

  store.commit(SET_CODE, value);
});

const blurInvalid = computed(
  () => store.state.code !== '' && exampleErrorColor.value === errorColor
);
const codeIsValid = computed(() => CODE_REGEX.test(store.state.code));

function validate() {
  if (store.state.code === '' || CODE_REGEX.test(store.state.code)) {
    exampleErrorText.value = exampleText;
    exampleErrorColor.value = exampleColor;
  } else {
    exampleErrorText.value = errorText;
    exampleErrorColor.value = errorColor;
  }
}

async function handleNext() {
  // TODO: remove
  window.setTimeout(() => {
    waiting.value = false;
  }, DefaultDuration);
  waiting.value = true;

  try {
    await store.dispatch(SAVE_FILE, store.state.code);
    props.next();
  } catch (error) {
    console.error(error);
    props.reset();
  }
}

function handleDismiss() {
  suggestedWord.value = null;
}

function handleFocus() {
  if (codeInputInner.value) {
    suggestedWord.value = getSuggestion(modelCode.value);
  }
}
</script>

<template>
  <CardVue :active="props.active">
    <template #title>
      <ion-text color="dark-grey" class="bold"
        >Receive files in real-time</ion-text
      >
    </template>
    <template #subtitle>
      <ion-text color="dark-grey">Always end-to-end encrypted.</ion-text>
    </template>
    <template #content>
      <ion-grid>
        <ion-row
          class="ion-text-center ion-justify-content-center ion-align-items-center"
        >
          <ion-col
            class="input-col"
            sizeLg="6"
            sizeMd="7"
            sizeSm="9"
            sizeXs="9"
          >
            <ion-input
              color="black"
              :class="{ invalid: blurInvalid, 'ion-margin-bottom': true }"
              autofocus
              :clearInput="store.state.code !== ''"
              type="text"
              placeholder="Enter code here"
              @change="validate"
              v-model="modelCode"
              @keyup.enter="handleNext"
              ref="codeInput"
              @ionFocus="handleFocus"
            ></ion-input>
            <PopoverVue
              :active="active"
              :elementRef="codeInputInner"
              :onDismiss="handleDismiss"
            >
              <AutoComplete :suggestedWord="suggestedWord" />
            </PopoverVue>
            <div class="flex-col">
              <ion-text :color="exampleErrorColor" v-show="blurInvalid">
                {{ exampleErrorText }}
              </ion-text>
              <ion-text :color="exampleErrorColor"
                >E.g.: 7-guitarist-revenge</ion-text
              >
            </div>
          </ion-col>
          <ion-col
            class="next-col ion-align-self-start ion-text-start"
            sizeXs="3"
          >
            <WaitButtonVue
              class="ion-no-margin receive-next"
              :disabled="!codeIsValid"
              :force="waiting"
              :click="handleNext"
            >
              <template v-slot:text>
                <ion-text>Next</ion-text>
              </template>
              <template v-slot:waiting-text>
                <ion-spinner name="crescent" color="dark"></ion-spinner>
              </template>
            </WaitButtonVue>
          </ion-col>
        </ion-row>
      </ion-grid>
    </template>
  </CardVue>
</template>

<style lang="css" scoped>
.invalid {
  border: 1px solid var(--ion-color-warning-red);
}

@media screen and (max-width: 455px) {
  .input-col {
    flex: 0 0 100% !important;
    width: 100% !important;
    max-width: 100% !important;
  }

  .next-col {
    text-align: center !important;
  }
}

@media screen and (max-width: 575px) {
  .receive-next {
    margin-left: 0;
  }

  .ion-text-xs-center {
    justify-content: center;
  }
}
</style>
