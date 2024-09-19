import express from "express"
import { addToNotifications, getNotifications } from "../controllers/notificationsController.js"
import authMiddleware from "../middleware/auth.js";
const notificationsRouter = express.Router();

notificationsRouter.post("/add",authMiddleware, addToNotifications);
notificationsRouter.post("/get", authMiddleware, getNotifications);

export default notificationsRouter;