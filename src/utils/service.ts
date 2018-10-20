import { ExpressServer, IExpressServerOptions } from "./express";
import { MongooseService, IMongooseServiceOptions } from "./mongoose";

interface IServiceSettings {
    express: IExpressServerOptions;
    mongoose: IMongooseServiceOptions;
}

class Service {
    public express: ExpressServer;
    public mongoose: MongooseService;

    private settings: IServiceSettings;

    constructor(settings: IServiceSettings) {
        this.settings = settings;

        this.express = new ExpressServer(this.settings.express);
        this.mongoose = new MongooseService(this.settings.mongoose);
    }

    public async start() {
        try {
            await this.express.up();
            await this.mongoose.connect();
        } catch (err) {
            throw err;
        }
    }

    public async stop() {
        try {
            await this.express.down();
            await this.mongoose.disconnect();
        } catch (err) {
            throw err;
        }
    }
}

export {
    IServiceSettings,
    Service,
    ExpressServer,
    MongooseService,
};
