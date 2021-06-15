<template>
    <WaitButton :click="copyLink">
            <template v-slot:text>
                <ion-icon :icon="copy"></ion-icon>
                <ion-label class="ion-padding-start">Copy</ion-label>
            </template>
            <template v-slot:waiting-text>
                <ion-label>Link copied!</ion-label>
            </template>
    </WaitButton>
</template>

<style scoped lang="css">
</style>

<script lang="ts">
import {defineComponent} from 'vue';

import {
    IonIcon,
    IonLabel,
} from '@ionic/vue';
import {copy} from 'ionicons/icons';
import WaitButton from './WaitButton.vue';

export default defineComponent({
    name: 'CopyButton',
    props: ['link'],
    data() {
        return {
            // disabled: !navigator.clipboard,
            waiting: false,
        }
    },
    methods: {
        copyLink() {
            navigator.clipboard.writeText(this.link);
        },
    },
    components: {
        WaitButton,
        IonIcon,
        IonLabel,
    },
    setup() {
        return {
            copy,
        }
    },
})
</script>
