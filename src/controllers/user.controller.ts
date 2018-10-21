import UserModel from "../models/user.model";
import { Request, Response } from "express";
import { generateKeypair } from "@gdprblack/secrets";

class UserController {
    public createUser(req: Request, res: Response) {

        const result = generateKeypair();

        const data = req.body;
        data.privateKey = result.private;
        data.publicKey = result.public;

        const newUser  = new User.model(data);

        newUser.save((err, user) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(201).json(user);
        });
    }
}

const User = {
    model: UserModel,
    controller: new UserController(),
};

export default User;
