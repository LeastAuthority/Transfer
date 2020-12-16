<template>
    <ion-header>
        <ion-toolbar>
            <ion-title>MyFileTransfer</ion-title>
            <ion-buttons slot="end">
                <ion-menu-button auto-hide="false"></ion-menu-button>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>
</template>

<script>
    import {
        IonHeader,
        IonToolbar,
        IonTitle,
        IonButtons,
        IonMenuButton,
    } from '@ionic/vue';

    export default {
        name: "MyHeader",
        components: {
            IonHeader,
            IonToolbar,
            IonTitle,
            IonButtons,
            IonMenuButton,
        }
    }
</script>

<style scoped>

</style>