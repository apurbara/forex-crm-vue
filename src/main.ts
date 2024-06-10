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
//
import AxiosHttpRequest from "./infrastructure/axios/axios-http-request";
import InMemoryCache from "./infrastructure/in-memory-cache";
import AxiosRestRequest from "./infrastructure/axios/axios-rest-request";
import UserRepository from "./user-bc/role/user-repository";
import CompanyUserRepository from "./company-bc/role/company-user-repository";
import SalesRepository from "./sales-bc/role/sales-repository";

// Styles
import "./assets/styles/main.scss";

const app = createApp(App);

// register global directives
app.directive("vFocus", { mounted: (el: HTMLElement) => el.focus() });

// register dependency injection
const userRepository = reactive(new UserRepository());
const companyUserRepository = reactive(new CompanyUserRepository());
const salesRepository = reactive(new SalesRepository());
// app.config.globalProperties.userRepository = reactive(userRepository);
app.provide("userRepository", userRepository);
app.provide("companyUserRepository", companyUserRepository);
app.provide("salesRepository", salesRepository);

const httpRequest = new AxiosHttpRequest();
const restRequest = new AxiosRestRequest();
app.provide("httpRequest", httpRequest);
app.provide("restRequest", restRequest);

const cache = new InMemoryCache();
app.provide("cache", cache);

registerPlugins(app);

app.mount("#app");
