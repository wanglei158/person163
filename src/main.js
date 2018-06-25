
import Vue from 'vue';
import App from './App.vue';
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import 'muse-ui/dist/theme-light.css';
Vue.use(MuseUI);

import router from './router'

import axios from 'axios';
import VueAxios from 'vue-axios';
Vue.use(VueAxios, axios)

import 'vue2-toast/lib/toast.css';
import Toast from 'vue2-toast';
Vue.use(Toast);

import { store } from './store';

import VueBus from 'vue-bus';
Vue.use(VueBus);


import 'font-awesome/css/font-awesome.css';




new Vue({
    el:'#app',
    router,
    store,
    render:h=>h(App)
})