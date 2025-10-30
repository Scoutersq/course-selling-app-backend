const { Router } = require("express");
const userRouter = Router();
const { userModel, purchaseModel } = require("../db.js");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const jwt = require("jsonwebtoken");

userRouter.post("/signup", async (req, res) => {
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
    await userModel.create({
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

userRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({
      email: email,
    });

    if (!user) {
      res.status(400).json({
        message: "Incorrect username or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(400).json({
        message: "Incorrect username or password",
      });
    }

    if (user && passwordMatch) {
      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_USER_SECRET
      );

     res.cookie("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      });
    }

    res.status(200).json({
      message: "Signed in successfull"
    });
  } catch (e) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

userRouter.get("/purchases", async(req, res) => {
  const userId = req.userId;

  const purchases = await purchaseModel.find({
    userId
  })

  res.json({
    purchases
  })
});

module.exports = {
  userRouter: userRouter,
};
