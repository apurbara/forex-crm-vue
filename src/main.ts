/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";
// import { createApp } from "vue/dist/vue.esm-bundler.js";

// Plugins
import { registerPlugins } from "@/plugins";
import { reactive } from "vue";
import AxiosHttpRequest from "./infrastructure/axios/axios-http-request";
import InMemoryCache from "./infrastructure/in-memory-cache";
import UserRepository from "./domain/user-repository";

// Styles
import "./assets/styles/main.scss";

const app = createApp(App);

// register global directives
app.directive("vFocus", { mounted: (el: HTMLElement) => el.focus() });

// register dependency injection
const userRepository = reactive(new UserRepository());
// app.config.globalProperties.userRepository = reactive(userRepository);
app.provide("userRepository", userRepository);

const httpRequest = new AxiosHttpRequest();
app.provide("httpRequest", httpRequest);

const cache = new InMemoryCache();
app.provide("cache", cache);

registerPlugins(app);

app.mount("#app");
