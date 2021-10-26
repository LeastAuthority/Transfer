<template>
    <ion-footer class="ion-no-border">
        <ion-grid>
            <ion-row class="ion-align-items-center">
                <ion-col class="footer" sizeXs="12" sizeMd="6">
                    <ion-row>
                        <ion-col size="3">
                            <a href="" target="_blank">
                                <ion-text color="black">
                                    FAQ
                                </ion-text>
                            </a>
                        </ion-col>
                        <ion-col size="3">
                            <a href="" target="_blank">
                                <ion-text color="black">
                                    Privacy
                                </ion-text>
                            </a>
                        </ion-col>
                        <ion-col size="3">
                            <a href="" target="_blank">
                                <ion-text color="black">
                                    About Us
                                </ion-text>
                            </a>
                        </ion-col>
                        <ion-col size="3">
                            <a href="" target="_blank">
                                <ion-text color="black">
                                    GitHub
                                </ion-text>
                            </a>
                        </ion-col>
                    </ion-row>
                </ion-col>
                <ion-col sizeXs="12" sizeMd="6" class="made-with-love flex ion-justify-content-end">
                    <ion-text color="dark-grey" class="ion-hide-sm-down">
                        made with love for privacy by
                    </ion-text>
                    <div class="la-logo"></div>
                </ion-col>
            </ion-row>
        </ion-grid>
    </ion-footer>
</template>

<script>
import {
    IonFooter,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
} from '@ionic/vue';


export default {
    name: "footer",
    components: {
        IonFooter,
        IonGrid,
        IonRow,
        IonCol,
        IonText,
    }
}
</script>

<style scoped>

.la-logo {
    background-image: url("/assets/logos/la-logo.svg");
    width: 143px;
    height: 28px;
    background-repeat: no-repeat;
    background-size: 140px;
}

.footer {
    text-align: center;
}

@media screen and (max-width: 767px) {
    .footer {
        margin-bottom: var(--md-margin);
    }

    .footer > ion-col {
        margin-right: var(--md-margin);
    }

    .made-with-love.ion-justify-content-end {
        justify-content: center !important;
    }
}

</style>
