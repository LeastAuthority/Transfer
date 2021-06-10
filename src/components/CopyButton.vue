<template>
    <ion-button class="copy-button"
                color="primary"
                @click="copyLink"
                :disabled="disabled">
        <ion-icon :icon="copy"></ion-icon>
        <ion-label class="ion-padding-start">Copy</ion-label>
    </ion-button>
</template>

<script>
    import {defineComponent} from 'vue';

    import {
        IonIcon,
        IonButton, IonLabel,
    } from '@ionic/vue';
    import {copy} from 'ionicons/icons';

    export default defineComponent({
        name: 'CopyButton.vue',
        props: ['host', 'code'],
        data() {
            return {
                disabled: !navigator.clipboard,
            }
        },
        methods: {
            copyLink() {
                const url = `${this.host}/#/r/${this.code}`;
                navigator.clipboard.writeText(url);
            },
        },
        components: {
            IonIcon,
            IonLabel,
            IonButton,
        },
        setup() {
            return {
                copy,
            }
        },
    })
</script>
