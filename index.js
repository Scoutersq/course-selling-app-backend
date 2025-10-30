const express = require("express");
const mongoose = require("mongoose")
const { userRouter } = require("./routes/user.js")
const { courseRouter } = require("./routes/course.js")
const { adminRouter } = require("./routes/admin.js")
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser")
dotenv.config();
const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/user",userRouter);
app.use("/admin",adminRouter)
app.use("/course",courseRouter);

async function main() {
    await mongoose.connect(process.env.MONGOOSE_URI);
    app.listen(3000);
    console.log("Server connnected to port 3000")   
}
main();
