import mongoose from "mongoose";

const notificationsSchema = new mongoose.Schema({
    orderId:{
        type: String,
        required: true
    },
    userId:{
        type: String,
        required: true,
    },
    isAccepted:{
        type: String,
        default: "UnSeen"
    }
})

const notificationsModel = mongoose.models.notifications || mongoose.model("notifications", notificationsSchema);

export default notificationsModel;