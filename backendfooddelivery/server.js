import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config"
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import medicineRouter from "./routes/medicineRoute.js";
import inventoryRouter from "./routes/inventoryRoute.js";
import notificationsRouter from "./routes/notificationsRouter.js";
// app config
const app = express();
const port = 4000

// middleware
app.use(express.json())
app.use(cors())

// db Connection
connectDB();

// api endpoints
app.use("/api/medicine", medicineRouter)
app.use("/images", express.static('uploads'))
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/inventory", inventoryRouter)
app.use("/api/notifications", notificationsRouter)
app.use("/api/order", orderRouter)

app.get("/", (request, response)=>{
    response.send("API Working")
})

app.listen(port, ()=>{
    console.log(`Server started on http://localhost:${port}`)
})
