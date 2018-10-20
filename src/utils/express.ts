import * as bodyParser from "body-parser";
import * as express from "express";
import * as logger from "morgan";
import { Server } from "http";
import * as cors from "cors";

interface IExpressServerOptions {
    port: number;
}

class ExpressServer {
    private app: express.Application;
    private options: IExpressServerOptions;
    private server?: Server;

    constructor(options: IExpressServerOptions) {
      this.options = options;
      this.app = express();
      this.middleware();
      this.health();
    }

    public up(): Promise<void> {
      return new Promise((resolve, reject) => {
        this.server = this.app.listen(this.options.port, (err: any) => {
          if (err) {
            reject(err);
          }
          resolve();
        });
      });
    }

    public down(): Promise<void> {
      return new Promise((resolve, reject) => {
        this.server!.close((err: any) => {
          if (err) {
            reject(err);
          }
          resolve();
        });
      });
    }

    public addRouter(route: string, router: express.Router): void;
    public addRouter(router: express.Router): void;
    public addRouter(routeOrRouter: any, router?: express.Router): void {
      if (!router) {
        this.app.use(routeOrRouter);
      } else {
        this.app.use(routeOrRouter, router);
      }
    }

    public getApp(): express.Application {
      return this.app;
    }

    private middleware(): void {
      switch (process.env.NODE_ENV) {
        case "production":
          this.app.use(logger("common"));
          break;
        case "test":
          break;
        default:
          this.app.use(logger("dev"));
          break;
      }
      const corsOption: cors.CorsOptions = {
        origin: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
        exposedHeaders: ["x-auth-token"],
      };

      this.app.use(cors(corsOption));
      this.app.use(bodyParser.json());
      this.app.use(bodyParser.urlencoded({
        extended: true,
      }));
    }

    private health(): void {
      this.app.get("/health", (req, res) => {
        return res.status(200).send("OK");
      });
    }

  }

export {
  IExpressServerOptions,
  ExpressServer,
};
