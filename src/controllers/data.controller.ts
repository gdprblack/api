import DataModel from "../models/data.model";
import { Request, Response } from "express";

class DataController {
    public createDataEntry(req: Request, res: Response) {
        const newData  = new Data.model(req.body);

        newData.save((err, data) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(201).json(data);
        });
    }

    public getDataEntry(req: Request, res: Response) {
        Data.model.findById(req.params.id, (err, data) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(201).json(data);
        });
    }
}

const Data = {
    model: DataModel,
    controller: new DataController(),
};

export default Data;
