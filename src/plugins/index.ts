import { inject } from "vue";
/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

import { App } from "vue";

// Plugins
import vuetify from "./vuetify";
import pinia from "../store";
import router from "../router";
import PrimeVue from "primevue/config";
import "primevue/resources/themes/soho-light/theme.css";

//service
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";

// Types
import Toast from "primevue/toast";
import ConfirmPopup from "primevue/confirmpopup";

export function registerPlugins(app: App) {
  app.use(vuetify).use(router).use(pinia).use(PrimeVue);

  // register primevue component
  app.component("Toast", Toast);
  app.component("ConfirmPopup", ConfirmPopup);

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

  // // register global directives
  // app.directive("focus", { mounted: (el) => el.focus() });

  // // register global properties
  // const userRepository = reactive(new UserRepository());
  // // app.config.globalProperties.userRepository = reactive(userRepository);
  // app.provide("userRepository", userRepository);

  // const httpRequest = new AxiosHttpRequest();
  // app.provide("httpRequest", httpRequest);
}
