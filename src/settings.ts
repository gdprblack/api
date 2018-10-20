import * as dotenv from "dotenv";
import { IServiceSettings } from "./utils/service";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const defaultPort = "3000";

const settings: IServiceSettings = {
  express: {
    port: parseInt(process.env.PORT || defaultPort, undefined),
  },
  mongoose: {
    uri: ""
  }
};

export { settings };
