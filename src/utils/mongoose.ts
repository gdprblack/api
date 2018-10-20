import * as mongoose from "mongoose";
import { MongoClient, Db } from "mongodb";

interface IMongooseServiceOptions {
  uri: string;
}

class MongooseService {
  public client?: mongoose.Mongoose;
  private options: IMongooseServiceOptions;

  constructor(options: IMongooseServiceOptions) {
    this.options = options;
  }

  public async connect(): Promise<void> {
    try {
      await mongoose.connect(this.options.uri);
      this.client = mongoose;
    } catch (err) {
      throw err;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
    } catch (err) {
      throw err;
    }
  }
}

export {
  IMongooseServiceOptions,
  MongooseService,
};
