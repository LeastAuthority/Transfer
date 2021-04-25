import { createStore } from 'vuex'
import {ClientConfig} from "@/go/wormhole/types";
import {DEFAULT_PROD_CLIENT_CONFIG} from "@/go/wormhole/client";

let defaultConfig: ClientConfig | undefined;
if (process.env['NODE_ENV'] === 'production') {
    defaultConfig = DEFAULT_PROD_CLIENT_CONFIG;
}

export default createStore({
    state() {
        return {
            config: defaultConfig || {},
        }
    },
    mutations: {
        setConfig(state: Record<string, any>, config: ClientConfig) {
            state.config = config;
        }
    },
    actions: {
        setConfig({commit}, config) {
            commit('setConfig', config);
        }
    },
    modules: {}
})
