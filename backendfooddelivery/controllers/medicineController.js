// import { log } from "console";
import medicineModel from "../models/medicineModel.js";
import fs from 'fs'

// add medicine

const addMedicine = async (req, res)=>{
    let image_filename = `${req.file.filename}`;
    const medicine = new medicineModel({
        name : req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    })
    try{
        await medicine.save();
        res.json({success: true, message: "Medicine Added Successfully"})
    }
    catch(error){
        console.log(error)
        console.log("Error Occured");
        
        res.json({success: false, message : "Failed to add the product"})
    }
}

// all medicine list
const listMedicine = async (req, res)=>{
    try {
        const medicines = await medicineModel.find({});
        res.json({success: true, data : medicines});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"})
    }
}

// remove Food Item

const removeMedicine = async (req, res)=>{
    try {
        const medicine = await medicineModel.findById(req.body._id);
        fs.unlink(`uploads/${medicine.image}`, ()=>{});
        await medicineModel.findByIdAndDelete(req.body._id);
        res.json({success: true, message : "Medicine removed Successfully"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"})
    }
}
export {addMedicine, listMedicine, removeMedicine}