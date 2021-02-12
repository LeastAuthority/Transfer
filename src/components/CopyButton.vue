<template>
    <ion-button class="copy-button"
                color="light"
                disabled>
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
        props: ['code'],
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