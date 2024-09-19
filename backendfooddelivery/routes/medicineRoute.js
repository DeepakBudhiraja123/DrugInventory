import express from "express"
import { addMedicine, listMedicine, removeMedicine } from "../controllers/medicineController.js"
import multer from "multer"

const medicineRouter = express.Router();

// Image storage engine
const storage = multer.diskStorage({
    destination: "uploads",
    filename:(res, file, cb)=>{
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage: storage})

medicineRouter.post("/add", upload.single("image"), addMedicine);
medicineRouter.get("/list", listMedicine);
medicineRouter.post("/remove", removeMedicine);
export default medicineRouter;