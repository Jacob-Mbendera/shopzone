
import express from "express";
import User from "../models/user.models.js";


const userRouter = express.Router();
userRouter.get('/', async (req,res) =>{
   const users = await User.find();
    res.send(users);
});

export default userRouter; 