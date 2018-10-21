import DataModel from "../models/data.model";
import { Request, Response } from "express";
import { encryptData, decryptKey, decryptData } from "@gdprblack/secrets";
import { addEvent, deployNewContract, getLogList, getLogData } from "@gdprblack/blockchain";
import Entity from "../controllers/entity.controller";
import User from "../controllers/user.controller";
import { UserRoles } from "../constants";

class DataController {
    public async createDataEntry(req: Request, res: Response) {
        const entity: any = await Entity.controller.getEntityUsers(req.body.entity);
        console.log(entity);
        const result = encryptData(req.body.data, entity.cpo, entity.boardMembers);
        result.entityId = req.body.entity;
        result.dbId = req.body.id;

        const newData = new Data.model(result);

        newData.save((err, data) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(201).json(data);
        });
    }

    public newDataObject(req: Request, res: Response) {
        const result = deployNewContract(req.body.mongoid);
        Promise.all([result]).then((values) => {
            res.status(201).json(values);
        });
    }

    public addEvent(req: Request, res: Response) {
        const result = addEvent(req.body.address, req.body.timestamp, req.body.user, req.body.type, req.body.metadata);
        Promise.all([result]).then((values) => {
            res.status(201).json(values);
        });
    }

    public getLogList(req: Request, res: Response) {
        const result = getLogList(req.body.address);
        Promise.all([result]).then((values) => {
            res.status(201).json(values);
        });
    }

    public getPublicDataEntry(req: Request, res: Response) {
        Data.model.findById(req.params.id, "dbId decrypted", (err, data) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(201).json(data);
        });
    }

    public async getDataEntry(req: Request, res: Response) {
        const data: any = await Data.model.findById(req.params.id, "entityId dbId decrypted signatures");
        if (data.decrypted) {
            decryptData(data.encryptedData, data.keys);
        }
        res.status(201).json(data);
    }

    public async signRequest(req: Request, res: Response) {
        const data: any = await Data.model.findById(req.params.id);
        const user: any = await User.model.findOne({ publicKey: req.body.publicKey });
        const members = await Entity.controller.getEntityUsers(data!.entityId);
        if (user.role === UserRoles.BoardMember) {
            const result = decryptKey(data.encryptedKeys.boardMembers[user.publicKey], req.body.privateKey);
            data.keys.boardMembers[user.publicKey] = result;
            data.signatures.boardMembers.push(user.publicKey);
        } else {
            const result = decryptKey(data.encryptedKeys.cpo, req.body.privateKey);
            data.keys.cpo = result.key;
            data.signatures.cpo = true;
        }
        if (data.signatures.cpo && data.signatures.boardMembers.length > members.boardMembers.length / 2) {
            data.decrypted = true;
        }
        data.save();
    }
}

const Data = {
    model: DataModel,
    controller: new DataController(),
};

export default Data;
