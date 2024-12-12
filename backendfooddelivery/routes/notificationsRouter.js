import express from "express"
import { addToNotifications, getNotifications, updateStatus } from "../controllers/notificationsController.js"
import authMiddleware from "../middleware/auth.js";
const notificationsRouter = express.Router();

notificationsRouter.post("/add",authMiddleware, addToNotifications);
notificationsRouter.post("/get", authMiddleware, getNotifications);
notificationsRouter.post("/status", authMiddleware, updateStatus);

export default notificationsRouter;