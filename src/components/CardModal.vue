<template>
    <ion-card>
        <slot></slot>
    </ion-card>
</template>

<script>
import {defineComponent} from "vue";
import {IonCard} from "@ionic/vue";

export default defineComponent({
    name: "CardModal",
    components: {
        IonCard,
    }
})
</script>

<style scoped>
ion-card {
    position: relative;
}
</style>
