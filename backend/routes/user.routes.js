
import express from "express";
import data from "../data/data.js";
import User from "../models/user.models.js";


const userRouter = express.Router();
userRouter.get('/', async (req,res) =>{
    await User.remove();

    const createdUsers = await User.insertMany(data.users);

    res.send(createdUsers);
});

export default userRouter;