import { Request, Response, Router } from "express";
import Data from "../controllers/data.controller";

export class PublicRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.addRoutes();
  }

  /**
   * getRouter
   * @returns returns the account router with all the access points.
   */
  public getRouter() {
    return this.router;
  }

  private addRoutes() {
    this.router.route("/data")
      .post(Data.controller.createDataEntry);

    this.router.route("/data/:id")
      .get(Data.controller.getPublicDataEntry);

    this.router.route("/data/newDataObject")
      .post(Data.controller.newDataObject);

    this.router.route("/data/addEvent")
      .post(Data.controller.addEvent);

    this.router.route("/data/getDataList")
      .get(Data.controller.getLogList);
  }
}
