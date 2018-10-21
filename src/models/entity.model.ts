import { Schema, mongoose } from "../utils/mongoose";
import * as randToken from "rand-token";

const EntitySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    apiKey: {
        type: String,
        default: () => randToken.generate(64),
    },
    __v: {
        type: Number,
        select: false,
    },
});

const Entity = mongoose.model("Entity", EntitySchema);

export default Entity;
