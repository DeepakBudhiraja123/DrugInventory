import express from "express"
import { getOneUser, loginUser, registerUser } from "../controllers/userController.js"

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/all', getOneUser);

export default userRouter;