import express from 'express';
import expresssyncHandler from 'express-async-handler';
import { isAuth } from '../utils.js';
import Order from '../models/order.models.js'


const orderRouter = express.Router();

orderRouter.post("/", isAuth, expresssyncHandler( async(req, res)=>{
    
   const newOrder = new Order({

    //mapping each orderItem with each product using the id
    orderItems: req.body.orderItems.map((x)=> ({...x, product: x._id})),
    shippingAddress:req.body.shippingAddress,
    paymentMethod:req.body.paymentMethod,
    itemsPrice:req.body.itemsPrice,
    shippingPrice:req.body.shippingPrice,
    taxPrice:req.body.taxPrice,
    totalPrice:req.body.totalPrice,
    user:req.user._id, //coming from isAuth middleware

   }) 

   const order  = await newOrder.save();

   res.status(201).send({message: "Order created successfully", order});

}))

export default orderRouter;