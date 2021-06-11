<template>
    <ion-button :class="{'copy-button': true, waiting}"
                color="primary"
                @click="copyLink"
                :disabled="disabled">
        <ion-icon :icon="copy"></ion-icon>
        <ion-label class="ion-padding-start">Copy</ion-label>
    </ion-button>
</template>

<style scoped lang="css">
ion-button {
    /*transition: background-color .3s ease;*/
    transition: background-color 1s ease;
}

ion-button.waiting {
    background-color: #f3d79b;
}

/*
:root {
    --ion-color-yellow: #f3d79b;
    --ion-color-yellow-rgb: 243,215,155;
    --ion-color-yellow-contrast: #000000;
    --ion-color-yellow-contrast-rgb: 0,0,0;
    --ion-color-yellow-shade: #d6bd88;
    --ion-color-yellow-tint: #f4dba5;
} */
</style>

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
                // disabled: !navigator.clipboard,
                waiting: false,
            }
        },
        methods: {
            copyLink() {
                const url = `${this.host}/#/${this.code}`;
                navigator.clipboard.writeText(url);
                window.setTimeout(() => {
                    this.waiting = false;
                }, 5000);
                this.waiting = true;
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
