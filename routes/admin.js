const { Router } = require("express");
const adminRouter = Router();
const { adminModel } = require("../db.js");
const { courseModel } = require("../db.js");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const { adminMiddleware } = require("../middlewares/admin.middleware.js");

adminRouter.post("/signup", async (req, res) => {
  const zodValidation = z.object({
    email: z.string().min(3).max(30).email("Invalid email format"),
    firstName: z.string().min(3).max(30, "Invalid firstName format"),
    lastName: z.string().min(3).max(30, "Invalid lastName format"),
    password: z.string().min(6).max(30, "Invalid password"),
  });

  const parsedData = zodValidation.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json({
      message: "Incorrect format",
      error: parsedData.error.errors,
    });
    return;
  }

  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  const hashedPassword = await bcrypt.hash(password, 5);

  try {
    await adminModel.create({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    });
    res.status(200).json({
      message: "Signed Up successfully",
    });
  } catch (e) {
    res.status(500).json({
      message: "Signup failed",
      error: e.message,
    });
  }
});

adminRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await adminModel.findOne({
      email: email,
    });

    if (!admin) {
      res.status(400).json({
        message: "Incorrect username or password",
      });
    }

    const passwordMatchAdmin = await bcrypt.compare(password, admin.password);

    if (!passwordMatchAdmin) {
      res.status(400).json({
        message: "Incorrect username or password",
      });
    }

    if (admin && passwordMatchAdmin) {
      const token = jwt.sign(
        {
          id: admin._id,
        },
        process.env.JWT_ADMIN_SECRET
      );

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      });
    }

    res.status(200).json({
      message: "Signed in successfull",
    });
  } catch (e) {
    res.status(500).json({
      message: "Server error",
    });
    console.log(e);
  }
});

adminRouter.post("/course", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const { title, description, imageUrl, price } = req.body;

  try {
   const course =  await courseModel.create({
      title: title,
      description: description,
      imageUrl: imageUrl,
      price: price,
      creatorId: adminId,
    });
    if (!title || !description || !price || !imageUrl) {
      res.json({
        message: "Enter full details",
      });
    }
    res.status(200).json({
      message: "Course created",
      courseId:course._id
    });
  } catch (e) {
    res.status(403).json({
      message: "Course not created",
    });
  }
});

adminRouter.put("/course", adminMiddleware,async (req, res) => {
  const adminId = req.userId;
  const { title, description, imageUrl, price, courseId } = req.body;

  const course = await courseModel.updateOne(
    {
      _id: courseId,
      creatorId:adminId
    },
    {
      title: title,
      description: description,
      imageUrl: imageUrl,
      price: price,
    }
  );
  res.status(200).json({
    message: "Course updated",
    courseId:course._id
  });
});

adminRouter.get("/course/bulk", adminMiddleware,async(req, res) => {
  const adminId = req.userId;
  try{
  const course = await courseModel.find({
    creatorId:adminId
  })
  res.json({
    message:"here are your courses",
    course
  })
}catch(e){
  res.status(403).json({
    message:"You are not logged in"
  })
}
});

module.exports = {
  adminRouter: adminRouter,
};
