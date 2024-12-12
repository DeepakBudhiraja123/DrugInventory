import notificationsModel from "../models/notificationsModel.js";

// Add items to user Cart 
const addToNotifications = async(req, res)=>{
    try {
        const {userId, orderId} = req.body;
        const newNotification = new notificationsModel({
            userId : userId,
            orderId: orderId
        })
        await newNotification.save();

        res.json({
            success: true,
            message: "Item Added to notification Successfully"
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Error"
        })
    }
}
// fetch user cart data

const getNotifications = async (req, res)=>{
    try {
        const notifications = await notificationsModel.find({userId: req.body.userId})
        res.json({
            success: true,
            data: notifications
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Error"
        })
    }
}
const updateStatus = async (req, res)=>{
    try {
        await notificationsModel.findByIdAndUpdate(req.body.id, {isAccepted: req.body.isAccepted});
        res.json({  
            success: true,
            message:"Status updated successfully"
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Error"
        })
    }
}
export {addToNotifications, getNotifications, updateStatus};