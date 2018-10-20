import { Service } from "./utils/service";
import { settings } from "./settings";

declare const global: {
  app: Service;
};

global.app = new Service(settings);

// global.app.express!.addRouter("/public", new PublicRouter().getRouter());

const app = global.app;

export { app };
