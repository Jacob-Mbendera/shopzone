
import express from "express";
import User from "../models/user.models.js";
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { generateToken } from "../utils.js";


const userRouter = express.Router();

userRouter.get('/', async (req,res) =>{
   const users = await User.find();
    res.send(users);
});

userRouter.post('/signin', expressAsyncHandler( async(req,res) =>{
    const user = await User.findOne({email: req.body.email});

    if(user){
        if(bcrypt.compareSync(req.body.password, user.password)){
            res.send({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user),
            })
            return;
        }
    }
    res.status(401).send({ message: "Invalid email or password"});
})

);

/*
userRouter.post('/signup', expressAsyncHandler( async(req,res)=>{

    let user = await User.findOne({email: req.params.body});

    if(user) return res.status(400).send({ message: "user with that email already  exists "});

    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        isAdmin: req.body.isAdmin
    });


    await user.save();

    res.send(user);

}))
*/
export default userRouter; 