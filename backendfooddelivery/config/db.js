import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://budhirajadeepak123:<password>@cluster0.covto.mongodb.net/?"
  ).then(()=>{
    console.log("DB connected");
  });
};
