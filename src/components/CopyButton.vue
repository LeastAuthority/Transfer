<template>
    <ion-button class="copy-button"
                color="light"
                @click="copyLink"
                :disabled="disabled">
        <ion-icon :icon="clipboardOutline"></ion-icon>
    </ion-button>
</template>

<script>
    import {defineComponent} from 'vue';

    import {
        IonIcon,
        IonButton,
    } from '@ionic/vue';
    import {clipboardOutline} from 'ionicons/icons';

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
                const url = `${this.host}/#/receive/${this.code}`;
                navigator.clipboard.writeText(url);
            },
        },
        setup() {
            return {
                clipboardOutline,
            }
        },
        components: {
            IonIcon,
            IonButton,
        }
    })
</script>
