<template>
    <WaitButton :click="copyLink"
                :disabled="disabled">
        <template v-slot:text>
            <ion-icon :icon="copy"></ion-icon>
            <ion-label style="margin-right: 6px;">Copy</ion-label>
        </template>
        <template v-slot:waiting-text>
            <ion-label>Link copied!</ion-label>
        </template>
    </WaitButton>
</template>

<style lang="css" scoped>
ion-icon {
    margin-right: 6px;
}
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
    props: ['link', 'disabled'],
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
