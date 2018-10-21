import { Schema, mongoose } from "../utils/mongoose";

const DataSchema = new Schema({
    entityId: {
        type: String,
        required: true,
    },
    dbId: {
        type: String,
        required: true,
    },
    encryptedData: {
        type: String,
        required: true,
    },
    encryptedKeys: {
        dpoKey: {
            type: String,
            required: true,
        },
        boardKeys: {
            type: Map,
            of: String,
            required: true,
        },
    },
    signatures: {
        dpo: {
            type: Boolean,
            default: false,
        },
        board: {
            type: Array,
            of: String,
        },
    },
    keys: {
        dpoKey: {
            type: String,
        },
        boardKeys: {
            type: Map,
            of: String,
        },
    },
    decrypted: {
        type: Boolean,
        default: false,
    },
    __v: {
        type: Number,
        select: false,
    },
});

const Data = mongoose.model("Data", DataSchema);

export default Data;
