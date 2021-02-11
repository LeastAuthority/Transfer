<template>
    <ion-footer class="footer ion-text-right ion-padding-end">
        <ion-text class="mono">{{ version }}</ion-text>
    </ion-footer>
</template>

<style scoped lang="css">
    .footer.md::before {
        background-image: none;
    }

    .mono {
        font-family: monospace;
    }
</style>

<script type="typescript">
    import {defineComponent} from 'vue'

    import VERSION from '@/version.ts'
    import {
        IonFooter,
        IonText,
    } from "@ionic/vue";

    export default defineComponent({
        name: 'VersionFooter',
        data() {
            return {
                version: VERSION,
            }
        },
        components: {
            IonFooter,
            IonText,
        },
    })
</script>