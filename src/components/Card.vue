<template>
    <!--    <transition name="step-fade">-->
    <!--    <transition name="step-fade" mode="out-in">-->
    <div v-show="active">
        <ion-card-header>
            <ion-card-title class="ion-padding-top">
                <slot name="title"></slot>
            </ion-card-title>
            <ion-card-subtitle>
                <slot name="subtitle"></slot>
            </ion-card-subtitle>
        </ion-card-header>
        <ion-card-content class="flex ion-justify-content-center">
            <slot name="content"></slot>
        </ion-card-content>
    </div>
    <!--    </transition>-->
</template>

<script>
import {
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
} from "@ionic/vue";

export default {
    name: "Card.vue",
    props: ['active'],
    components: {
        IonCardHeader,
        IonCardTitle,
        IonCardSubtitle,
        IonCardContent,
    }
}
</script>

<style scoped>
ion-card-header {
    margin-left: calc(var(--main-left-margin) - 16px);

}

ion-card-title {
    font-size: 2.5rem;
}

@media screen and (max-width: 575px) {
    ion-card-title {
        font-size: 1.35rem;
    }
}

ion-card-subtitle {
//margin-left: var(--md-margin); margin-right: var(--md-margin);

    font-size: 14px;
    font-weight: 500;
}

ion-card-subtitle > * {
    margin-left: 1rem;
}

ion-card-header {
    padding: var(--card-padding) !important;
}

ion-card-content {
    padding: var(--card-padding) !important;
}

ion-card-content p ion-text {
    font-size: 14px;
    font-weight: 500;
}

ion-card {
    margin: var(--card-margin) !important;
}

.step-fade-enter-active, .step-fade-leave-active {
    transition: opacity .3s ease;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
}

.step-fade-enter-from, .step-fade-leave-to {
    opacity: 0;
}
</style>
