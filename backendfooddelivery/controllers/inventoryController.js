import userModel from "../models/userModel.js"

// Add items to user Cart 
const addToInventory = async(req, res)=>{
    try {
        let userData = await userModel.findById(req.body.userId)
        let inventoryData = await userData.inventoryData;
        if(!inventoryData[req.body.itemId]){
            inventoryData[req.body.itemId] = 1;
        }
        else{
            inventoryData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, {inventoryData});
        res.json({
            success: true,
            message: "Item Added to inventory Successfully"
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Error"
        })
    }
}

// remove items from user Cart
const removeFromInventory = async(req, res)=>{
    try {
        let userData = await userModel.findById(req.body.userId);
        let inventoryData = await userData.inventoryData;
        if(inventoryData[req.body.itemId]>0){
            inventoryData[req.body.itemId] -= 1;
        }

        await userModel.findByIdAndUpdate(req.body.userId, {inventoryData});
        res.json({
            success: true,
            message: "Item removed from Inventory Successfully"
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

const getInventory = async (req, res)=>{
    try {
        let userData = await userModel.findById(req.body.userId);
        let inventoryData = await userData.inventoryData;
        res.json({
            success: true,
            inventoryData
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Error"
        })
    }
}

export {addToInventory, removeFromInventory, getInventory};