import { Schema, mongoose } from "../utils/mongoose";

const UserSchema = new Schema({
    entityId: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    publicKey: {
        type: String,
        required: true,
    },
    privateKey: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        required: true,
    },
    __v: {
        type: Number,
        select: false,
    },
});

const User = mongoose.model("User", UserSchema);

export default User;
