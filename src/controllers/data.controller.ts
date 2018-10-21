import DataModel from "../models/data.model";
import { Request, Response } from "express";
<<<<<<< HEAD
import { encryptData, decryptKey, decryptData } from "@gdprblack/secrets";
import { addEvent, deployNewContract, getLogList, getLogData } from "@gdprblack/blockchain";
=======
import { encryptData, decryptKeys, decryptData, decryptKeyBoard } from "@gdprblack/secrets";
>>>>>>> 7b53388e63b4b278839a8099a0d051adff9b5d7f
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
            const secret = decryptKeys("a", "TODO");
            decryptData(data.encryptedData, secret);
        }
        res.status(201).json(data);
    }

    public async signRequest(req: Request, res: Response) {
        const data: any = await Data.model.findById(req.params.id);
        const user: any = await User.model.findOne({ publicKey: req.body.publicKey });
        const members = await Entity.controller.getEntityUsers(data!.entityId);
        console.log(user.role, UserRoles.BoardMember, user.role === UserRoles.BoardMember);
        if (user.role === UserRoles.BoardMember) {
            const result = decryptKeyBoard(data.encryptedKeys.boardKeys.get(user.publicKey), req.body.privateKey);
            console.log(result);
            console.log(data.keys);
            if (!data.keys.boardKeys) {
                data.keys.boardKeys = {};
            }
            data.keys.boardKeys.set(user.publicKey, result);
            data.signatures.board.push(user.publicKey);
        } else {
            console.log("DPO");
            const result = decryptKeys(data.encryptedKeys.dpoKey, req.body.privateKey);
            data.keys.dpoKey = result;
            data.signatures.dpo = true;
        }
        if (data.signatures.dpo && data.signatures.board.length > members.boardMembers.length / 2) {
            data.decrypted = true;
        }
        data.save();
        res.send(data);
    }
}

const Data = {
    model: DataModel,
    controller: new DataController(),
};

export default Data;
