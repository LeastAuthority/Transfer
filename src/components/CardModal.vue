<template>
    <ion-card>
        <slot></slot>
        <div class="version">
            <ion-text color="dark-grey">
                v0.0.1-alpha
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
    margin-right: var(--sm-margin);
    margin-bottom: var(--sm-margin);
    padding: var(--ion-padding);
    background: rgba(255, 255, 255, 0.6);
}
</style>
