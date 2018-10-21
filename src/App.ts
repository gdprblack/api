import { Service } from "./utils/service";
import { settings } from "./settings";
import { PublicRouter } from "./routers/public.router";
import { EntityRouter } from "./routers/entity.router";
import { UserRouter } from "./routers/user.router";

declare const global: {
  app: Service;
};

global.app = new Service(settings);

global.app.express.addRouter("/public", new PublicRouter().getRouter());
global.app.express.addRouter("/entity", new EntityRouter().getRouter());
global.app.express.addRouter("/user", new UserRouter().getRouter());

const app = global.app;

export { app };
