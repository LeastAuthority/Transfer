<template>
    <div v-show="active">
        <ion-card-header>
            <ion-card-title>
                <!--            {{title}}-->
                Sent!
            </ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <ion-grid>
                <ion-row class="ion-justify-content-center ion-align-items-center">
                    <ion-col class="ion-text-center">
                        <!--                            "wild cat card"-->
                        <ion-text class="bold">
                            {{ fileMeta.name }}
                        </ion-text>
                        <!--                            <ion-text>-->
                        <!--                                ({{ fileSize }})-->
                        <!--                            </ion-text>-->
                    </ion-col>
                </ion-row>
<!--                <ion-row>-->
<!--                    <ion-col class="ion-text-center">-->
<!--                        <ion-text class="filename">{{ fileMeta.name }}</ion-text>-->
<!--                    </ion-col>-->
<!--                </ion-row>-->
                <!--        <ion-row>-->
                <!--            <ion-col class="ion-text-center">-->
                <!--                <ion-text class="size">({{ fileSize() }})</ion-text>-->
                <!--            </ion-col>-->
                <!--        </ion-row>-->
                <ion-row>
                    <ion-col>
                        <ion-text class="ion-text-center">
                            <h1>
                                &#x1f389; <!-- party popper -->
                            </h1>
                        </ion-text>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col class="ion-text-center">
                        <ion-button color="light"
                                    @click="sendMore">
                            <ion-icon :icon="add"></ion-icon>
                            <ion-text class="ion-padding-start">send more</ion-text>
                        </ion-button>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-card-content>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {
    IonButton,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCol,
    IonGrid,
    IonIcon,
    IonRow,
    IonText
} from "@ionic/vue";
import {mapState} from "vuex";
import {add} from "ionicons/icons";
import {FileMeta} from "@/store";
import {sizeToClosestUnit} from "@/util";

export default defineComponent({
    name: "SendComplete",
    props: ['active', 'sendMore'],
    computed: {
        ...mapState(['fileMeta']),
        // fileSize(): string {
        //     // TODO: cleanup.
        //     const fileMeta = this.fileMeta as unknown as FileMeta;
        //     // return sizeToClosestUnit(fileMeta.size);
        //     return '100MB';
        // },
    },
    // methods: {
    //     sendMore(): void {
    //         this.$router.replace('/s?select')
    //     }
    // },
    components: {
        IonGrid,
        IonRow,
        IonCol,
        IonButton,
        IonIcon,
        IonText,
        IonCardHeader,
        IonCardTitle,
        IonCardContent,
    },
    setup() {
        return {
            add
        }
    },
});
</script>

<style scoped>

</style>
