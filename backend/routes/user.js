const express = require("express");
const {loginSchema, signupSchema} = require("../zod");
const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");
const { User } = require("../db");
const userRouter = express.Router();
const bcrypt = require('bcryptjs');



userRouter.post("/signup", async (req,res) => {
    try {
        console.log('first');
        const { name, email, password } = signupSchema.parse(req.body);
        console.log('second');
        const existingUser = await User.findOne({ email });
        if (existingUser) 
            return res.status(400).json({ error: "Email already exists" });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword });
    
        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);
        res.status(201).json({ token, user: { name: newUser.name, email: newUser.email } });
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    })

userRouter.post("/signin", async (req, res) => {
        try {
          const { email, password } = loginSchema.parse(req.body);
          const user = await User.findOne({ email });
          if (!user) return res.status(400).json({ error: "Invalid credentials" });
      
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
      
          const token = jwt.sign({ userId: user._id }, JWT_SECRET);
          res.json({ token, user: { name: user.name, email: user.email } });
          console.log('signed in')
        } catch (err) {
          res.status(400).json({ error: err.message });
        }
      })




module.exports = userRouter;

// const updateUser = zod.object({
//     password: zod.string().optional(),
//     firstname: zod.string().optional(),
//     lastname: zod.string().optional()
// })

// userRouter.put("/", authMiddleware, async(req, res) => {
//     const updateBody = req.body;
//     const { success } = updateUser.safeParse(updateBody);
//     if(!success) {
//         return res.status(411).json({
//             message: "error while updating information"
//         })
//     }
//     // upadting the user according to parameters passed based on id
    
//     await User.updateOne({_id: req.userId}, req.body) 

//         return res.status(200).json({
//             message: "Updated the details successfully"
//     })
// })


// module.exports = userRouter;