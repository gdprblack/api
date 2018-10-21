import { Request, Response, Router } from "express";
import Data from "../controllers/data.controller";

export class DataRouter {
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
    this.router.route("/:id/sign")
      .post(Data.controller.signRequest);

    this.router.route("/:id")
      .get(Data.controller.getDataEntry);
  }
}
