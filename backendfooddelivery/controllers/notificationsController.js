import userModel from "../models/userModel.js"

// Add items to user Cart 
const addToNotifications = async(req, res)=>{
    try {
        let userData = await userModel.findById(req.body.userId)
        let notifications = await userData.notifications;
        
        notifications.unshift();
        await userModel.findByIdAndUpdate(req.body.userId, {notifications});
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
        let userData = await userModel.findById(req.body.userId);
        let notifications = await userData.notifications;
        res.json({
            success: true,
            notifications
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Error"
        })
    }
}

export {addToNotifications, getNotifications};