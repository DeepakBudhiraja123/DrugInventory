import userModel from "../models/userModel.js"; 

// Add items to user Cart 
const addToInventory = async(req, res)=>{
    try {
        
        let user = await userModel.findById(req.body.userId);
        let inventoryData = user.inventoryData;

        req.body.items.map((item, index)=>{
            if(!inventoryData[item._id]){
                inventoryData[item._id] = item.quantity;
            }
            else{
                inventoryData[item._id] += item.quantity;
            }
        })
        await userModel.findByIdAndUpdate(req.body.userId, {"inventoryData": inventoryData});
        
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

// // remove items from user Cart
const removeFromInventory = async(req, res)=>{
//     try {
//         let inventoryData = await inventoryModel.findById(req.body.userId)
//         res.json({
//             success: true,
//             inventoryData
//         })
//     } catch (error) {
//         console.log(error);
//         res.json({
//             success: false,
//             message: "Error"
//         })
//     }
}

// // fetch user cart data

const getInventory = async (req, res)=>{
    try {
        let user = await userModel.findById(req.body.userId)
        let inventoryData = user.inventoryData;
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