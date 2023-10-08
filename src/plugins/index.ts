import { inject } from 'vue';
/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from "./vuetify";
import pinia from "../store";
import router from "../router";
import PrimeVue from "primevue/config";

import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";

import Toast from "primevue/toast";

// Types
import UserRepository from "@/domain/user-repository";
import { App, reactive } from "vue";
// import AxiosHttpRequest from '@/infrastructure/axios/axios-http-request';
import MockHttpRequest from '@/infrastructure/mock/mock-http-request';

export function registerPlugins(app: App) {
  app.use(vuetify).use(router).use(pinia).use(PrimeVue, {
    ripple: true,
    inputStyle: "outlined",
  });

  // register primevue component
  app.component("Toast", Toast);

  // register global primevue service
  app.use(ConfirmationService);
  app.use(ToastService);

  // handling global error
  app.config.errorHandler = (err: any, instace, info) => {
    console.log(err);
    // app.config.globalProperties.$toast.add({
    //   severity: "error",
    //   summary: "Error",
    //   detail: err.detail ?? "unknown error",
    //   life: 3000,
    // });
  };

  // register global directives
  app.directive("focus", { mounted: (el) => el.focus() });

  // register global properties
  const userRepository = reactive(new UserRepository());
  // app.config.globalProperties.userRepository = reactive(userRepository);
  app.provide("userRepository", userRepository);

  // const httpRequest = new AxiosHttpRequest();
  const httpRequest = new MockHttpRequest();
  app.provide("httpRequest", httpRequest);
}
