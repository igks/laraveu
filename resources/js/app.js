import Vue from "vue";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap";

import BootstrapVue from "bootstrap-vue";
import FlashMessage from "@smartweb/vue-flash-message";

Vue.use(BootstrapVue);
Vue.use(FlashMessage);

import router from "./router";

new Vue({
    el: "#app",
    router,
    render: h => h(App)
});
