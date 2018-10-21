import DataModel from "../models/data.model";
import { Request, Response } from "express";
import { encryptData, decryptKeys, decryptData, decryptKeyBoard, decryptSecrets } from "@gdprblack/secrets";
import Entity from "../controllers/entity.controller";
import User from "../controllers/user.controller";
import { UserRoles } from "../constants";
import axios from "axios";

class DataController {

    public createDataEntry = async (req: Request, res: Response) => {
        const entity: any = await Entity.controller.getEntityUsers(req.body.entity);
        const result = encryptData(req.body.data, entity.cpo, entity.boardMembers);
        result.entityId = req.body.entity;
        result.dbId = req.body.id;

        result.address = await this.newDataObject(req.body.id);

        const newData = new Data.model(result);

        newData.save(async (err, data) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(201).json(data);
        });
    }

    public async newDataObject(mongoID) {
        const result = await axios.post("http://localhost:8080/blockchain/deployNewContract", {mongoID});
        return result.data;
    }

    public async addEvent(address, timestamp, user, type, metadata) {
        const result = await axios.post("http://localhost:8080/blockchain/addEvent", {address, timestamp, user, type, metadata});
        return result.data;
    }

    public async getLogList(address) {
        const result = await axios.post("http://localhost:8080/blockchain/getLogList", {address});
        return result.data;
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
        const data: any = await Data.model.findById(req.params.id, "entityId dbId decrypted signatures keys encryptedData");
        let decryptedData = null;
        if (data.decrypted) {
            console.log("DPO", data.keys.dpoKey);
            console.log("BOARD", Array.from(data.keys.boardKeys.values()).map((x: string) => new Buffer(x)));
            const secret = decryptSecrets(data.keys.dpoKey, Array.from(data.keys.boardKeys.values()).map((x: string) => new Buffer(x)));
            console.log(secret);
            console.log(data.encryptedData);
            decryptedData = decryptData(data.encryptedData, secret);
            console.log(decryptedData);
        }
        res.send({data, decryptedData});
    }

    public async signRequest(req: Request, res: Response) {
        const data: any = await Data.model.findById(req.params.id);
        const user: any = await User.model.findOne({ publicKey: req.body.publicKey });
        const members = await Entity.controller.getEntityUsers(data!.entityId);
        if (user.role === UserRoles.BoardMember) {
            const result = decryptKeyBoard(data.encryptedKeys.boardKeys.get(user.publicKey), req.body.privateKey);
            if (!data.keys.boardKeys) {
                data.keys.boardKeys = {};
            }
            data.keys.boardKeys.set(user.publicKey, result);
            data.signatures.board.push(user.publicKey);
        } else {
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
