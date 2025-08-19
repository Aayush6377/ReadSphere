import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["author","admin"],
        default: "author",
        required: true
    }
});

userSchema.pre("save",async function (next){
    if (!this.isModified("password")) next();
    try {
        const hash = await bcrypt.hash(this.password,12);
        this.password = hash;
        next();
    } catch (error) {
        next(error);
    }
});

const Users = mongoose.model("User",userSchema);

export default Users;

