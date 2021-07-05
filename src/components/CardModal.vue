<template>
    <ion-card>
        <slot></slot>
        <div class="version">
            <ion-text color="dark-grey">
                v0.0.0-alpha.0
            </ion-text>
        </div>
    </ion-card>
</template>

<script>
import {defineComponent} from "vue";
import {IonCard, IonText} from "@ionic/vue";

export default defineComponent({
    name: "CardModal",
    components: {
        IonCard,
        IonText,
    }
})
</script>

<style lang="css" scoped>
ion-card {
    position: relative;
}

ion-card > .version {
    position: absolute;
    bottom: 0;
    right: 0;
    margin-right: var(--ion-margin);
    margin-bottom: var(--ion-margin);
    padding: var(--ion-padding);
    background: rgba(255, 255, 255, 0.6);
}
</style>
