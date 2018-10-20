import { Schema, mongoose } from "../utils/mongoose";

const DataSchema = new Schema({
    test: {
        type: String,
        required: true,
    },
    __v: {
        type: Number,
        select: false,
    },
});

const Data = mongoose.model("Data", DataSchema);

export default Data;
