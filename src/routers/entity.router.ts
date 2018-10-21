import { Request, Response, Router } from "express";
import Entity from "../controllers/entity.controller";

export class EntityRouter {
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
    this.router.route("/")
      .post(Entity.controller.createEntity);

    this.router.route("/:id")
      .get(async (req, res) => { res.send(await Entity.controller.getEntityUsers(req.params.id));  });
  }
}
