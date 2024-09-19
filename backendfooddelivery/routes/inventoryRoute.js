import express from "express"
import { addToInventory, removeFromInventory, getInventory } from "../controllers/inventoryController.js"
import authMiddleware from "../middleware/auth.js";
const inventoryRouter = express.Router();

inventoryRouter.post("/add",authMiddleware, addToInventory);
inventoryRouter.post("/remove",authMiddleware, removeFromInventory);
inventoryRouter.post("/get", authMiddleware,getInventory);

export default inventoryRouter;