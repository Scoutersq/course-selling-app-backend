const  mongoose  = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const userSchema = new Schema({
    email:String,
    password: String,
    firstName: String,
    lastName: String
})

const courseSchema = new Schema({
    title:String,
    description: String,
    price: Number,
    imageUrl: String,
    creatorId: ObjectId
})

const adminSchema = new Schema({
      email:{
        type:String,
        unique:true,
        required:true
    },
      password: {
        type:String,
        required:true
    },
    firstName:String,
    lastName:String
})

const purchaseSchema = new Schema({
    userId:ObjectId,
    courseId:ObjectId,
})

const userModel = mongoose.model("user",userSchema);
const adminModel = mongoose.model("admin",adminSchema);
const courseModel = mongoose.model("course",courseSchema);
const purchaseModel = mongoose.model("purchase",purchaseSchema);

module.exports = {
    userModel:userModel,
    adminModel:adminModel,
    courseModel:courseModel,
    purchaseModel:purchaseModel
}
