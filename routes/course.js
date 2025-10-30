const { Router } = require("express");
const  { userMiddleware }  = require("../middlewares/user.middleware.js");
const { purchaseModel, courseModel } = require("../db.js");
const courseRouter = Router();

courseRouter.post("/purchase",userMiddleware,async(req,res)=>{
   const userId = req.userId;
   const courseId = req.body.courseId;

   await purchaseModel.create({
    userId,
    courseId
   })

   res.json({
    message:"You have successfully purchased the course"
   })
})

courseRouter.get("/preview",async function(req,res){
    const courses = await courseModel.find({});
    res.json({
        courses
    })
})

module.exports={
    courseRouter:courseRouter
}