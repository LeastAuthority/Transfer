<template>
    <ion-footer class="ion-no-border">
        <ion-grid>
            <ion-row class="ion-align-items-center">
                <ion-col class="footer flex" size="5">
                    <div class="links flex">
                        <div>
                            <a href="" target="_blank">
                                <ion-text color="black">
                                    FAQ
                                </ion-text>
                            </a>
                        </div>
                        <div>
                            <a href="" target="_blank">
                                <ion-text color="black">
                                    Privacy
                                </ion-text>
                            </a>
                        </div>
                        <div>
                            <a href="" target="_blank">
                                <ion-text color="black">
                                    About Us
                                </ion-text>
                            </a>
                        </div>
                        <div>
                            <a href="" target="_blank">
                                <ion-text color="black">
                                    GitHub
                                </ion-text>
                            </a>
                        </div>
                    </div>
                    <div class="mobile-la-logo flex ion-justify-content-center">
                        <div class="la-logo"></div>
                    </div>
                </ion-col>
                <ion-col class="made-with-love-container flex ion-justify-content-end">
                    <ion-text color="dark-grey" class="made-with-love">
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

.links > * {
    margin-right: 1rem;
}

@media screen and (max-width: 716px) {
    .footer {
        width: 100% !important;
        max-width: 100% !important;
        flex-basis: 100% !important;

        justify-content: center;
    }

    .links {
        justify-content: center;
    }

    .made-with-love-container {
        display: none;
    }
}

@media screen and (min-width: 716px) {
    .mobile-la-logo {
        display: none;
    }

    .links:first-child {
        margin-left: var(--main-margin);
    }

    .made-with-love-container:last-child {
        margin-right: var(--main-margin);
    }
}

@media screen and (max-width: 448px) {
    .links {
        margin-bottom: var(--md-margin);
    }

    .made-with-love-container {
        display: flex;
        justify-content: center !important;
    }

    .mobile-la-logo {
        display: none;
    }
}

@media screen and (max-width: 359px) {
    .made-with-love {
        display: none;
    }
}

</style>
