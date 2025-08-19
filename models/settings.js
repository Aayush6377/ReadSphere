import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
    website_title: {
        type: "String",
        required: true
    },
    website_logo: {
        type: "String",
        required: true
    },
    footer_description: {
        type: "String",
        required: true
    }
});

const Settings = mongoose.model("Setting",settingsSchema);

export default Settings;