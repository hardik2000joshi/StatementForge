import mongoose,{ model, models, Schema } from "mongoose";

const UserSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    role: String,
    organization: String,
    profile: {
        companyName: String,
        address: String,
        phone: String,
    },
}, 
{
    collection: "Users",
}
);

export default models.User || model("User", UserSchema);