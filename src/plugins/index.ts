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

//service
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";

// Types
import Toast from "primevue/toast";
import ConfirmPopup from "primevue/confirmpopup";

// import "../assets/tailwind.css";
import Aura from "@primevue/themes/aura";
import { definePreset } from "@primevue/themes";

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "#f4fafd",
      100: "#e9f5fc",
      200: "#cdeaf9",
      300: "#b2def5",
      400: "#96d3f2",
      500: "#36a6db", // Warna utama
      600: "#5ebce9",
      700: "#42b1e5",
      800: "#369dd2",
      900: "#2c85b2",
      950: "#256c8e",
    },
    colorScheme: {
      light: {
        primary: {
          color: "{primary.500}",
          contrastColor: "#ffffff",
          hoverColor: "{primary.600}",
          activeColor: "{primary.700}",
        },
        highlight: {
          background: "{primary.50}",
          focusBackground: "{primary.100}",
          color: "{primary.700}",
          focusColor: "{primary.800}",
        },
      },
    },
  },
});

export function registerPlugins(app: App) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(PrimeVue, {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: "false",
          cssLayer: false,
        },
        // preset: MyPreset,
        // options: {
        //   cssLayer: {
        //     name: "primevue",
        //     order: "tailwind-base, primevue, tailwind-utilities",
        //   },
        //   darkModeSelector: false || "none",
        // },
      },
    });

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
