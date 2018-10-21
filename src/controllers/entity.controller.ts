import EntityModel from "../models/entity.model";
import { Request, Response } from "express";
import { generateKeypair } from "@gdprblack/secrets";
import User from "./user.controller";
import { UserRoles } from "../constants";

class EntityController {
    public createEntity(req: Request, res: Response) {

        const newEntity  = new Entity.model(req.body);

        newEntity.save((err, entity) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(201).json(entity);
        });
    }

    public async getEntityUsers(entityId: string) {
        const boardMembers = await User.model.find({ entityId, role: UserRoles.BoardMember });
        const cpo = await User.model.findOne({entityId, role: UserRoles.CPO});
        return {boardMembers, cpo};
    }
}

const Entity = {
    model: EntityModel,
    controller: new EntityController(),
};

export default Entity;
