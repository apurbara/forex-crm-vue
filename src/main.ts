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
// import UserRepository from "./user-bc/role/user-repository";
import CompanyUserRepository from "./company-bc/role/company-user-repository";
import SalesRepository from "./sales-bc/role/sales-repository";

// Styles
import "./assets/styles/main.scss";
import "./assets/tailwind.css";
import ManagerRepository from "./manager-bc/role/manager-repository";
import AdminRepository from "./admin-bc/role/admin-repository";

const app = createApp(App);

// register global directives
app.directive("vFocus", { mounted: (el: HTMLElement) => el.focus() });

// register dependency injection
// app.config.globalProperties.userRepository = reactive(userRepository);
const httpRequest = new AxiosHttpRequest();
app.provide("httpRequest", httpRequest);
const restRequest = new AxiosRestRequest();
app.provide("restRequest", restRequest);

const companyUserRepository = reactive(
  new CompanyUserRepository(httpRequest, restRequest)
);
app.provide("companyUserRepository", companyUserRepository);
const adminRepository = reactive(new AdminRepository(httpRequest, restRequest));
app.provide("adminRepository", adminRepository);
const managerRepository = reactive(
  new ManagerRepository(httpRequest, restRequest)
);
app.provide("managerRepository", managerRepository);
const salesRepository = reactive(new SalesRepository(httpRequest, restRequest));
app.provide("salesRepository", salesRepository);
// const userRepository = reactive(new UserRepository());
// app.provide("userRepository", userRepository);

const cache = new InMemoryCache();
app.provide("cache", cache);

registerPlugins(app);

app.mount("#app");
