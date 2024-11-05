import "./assets/index.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { ZwdImage } from "./custom-components";

const app = createApp(App);

app.use(createPinia());
app.component("ZwdImage", ZwdImage);

app.mount("#app");
