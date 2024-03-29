import express from 'express';
import expresssyncHandler from 'express-async-handler';
import { isAdmin, isAuth, mailgun } from '../utils.js';
import Order from '../models/order.models.js'
import User from '../models/user.models.js'
import expressAsyncHandler from 'express-async-handler';
import Product from '../models/product.models.js';
import { payOrderEmailTemplate } from '../utils.js';


const orderRouter = express.Router();

orderRouter.get("/", isAuth,isAdmin, expressAsyncHandler(async(req,res)=>{
   const orders = await Order.find().populate("user", "name"); //in Order Model; will get user object & its info in user collect, but we only want the name
      res.send(orders)
}))



orderRouter.get("/mine", isAuth, expressAsyncHandler(async(req,res)=>{
   const orders = await Order.find({user: req.user._id}); //returns ALL the orders of a current use
      res.send(orders)
}))



orderRouter.get("/summary", isAuth, isAdmin, expressAsyncHandler(async(req, res)=>{

   const orders = await Order.aggregate([

      {
         $group:{
            _id: null, //group all data AND
            numOfOrders: {$sum: 1}, // counts # of elements/documents in Order collection(Orders) & set it to numOfOrder
            totalSales: {$sum: "$totalPrice"}

         },
      },

   ]);

   const users = await User.aggregate([

      {
         $group:{
            _id: null,
            numOfUsers: {$sum: 1} 
         },
      },

   ]);

   const dailyOrders = await Order.aggregate([

      {
         $group:{
            _id: {$dateToString: {format: "%Y-%m-%d", date: "$createdAt" }},
            orders: {$sum : 1},
            sales: { $sum: "$totalPrice"}
         },
      },

      {$sort: {
            _id: 1
         }
      }

   ]);

   const  productCategories = await Product.aggregate([
      {
      $group:{
         _id: "$category",
         count: {$sum: 1},
      }
   
   }
   ])

   res.send({orders, users, dailyOrders, productCategories});

}));


orderRouter.get("/:id", isAuth, expressAsyncHandler(async(req,res)=>{
   const order = await Order.findById(req.params.id);

   if(order){
      res.send(order)
   } else{
      res.status(404).send({message: "Order with that id not found"});
   }
}))

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


orderRouter.put("/:id/deliver", isAuth, expressAsyncHandler(async(req,res)=>{

   const order = await Order.findById(req.params.id);

   if(order){
      order.isDelivered = true,
      order.deliveredAt = Date.now();

      await order.save();
      res.send(order);
   } else{
      res.status(404).send({ message: "Order not found"});
   }

}))


orderRouter.put("/:id/pay", expressAsyncHandler(async(req,res)=>{

         const order = await Order.findById(req.params.id).populate("user", "email name");

         if(order){
            order.isPaid = true,
            order.paidAt = Date.now(),
            order.paymentResult = {
               id: req.body.id,
               status: req.body.status,
               update_time: req.body.update_time,
               email_address: req.body.email_address,
            }

            const updatedOrder = await  order.save();
            mailgun().messages().send(
              {
                from: 'ShopZOne <shozone@mg.yourdomain.com>',
                to: `${order.user.name} <${order.user.email}>`,
                subject: `New order ${order._id}`,
                html: payOrderEmailTemplate(order),
              },
              (error, body) => {
                if (error) {
                  console.log(error);
                } else {
                  console.log(body);
                }
              }
            );
            res.send({message: "Order Paid", order: updatedOrder });
         } else{
            res.status(404).send({message: "Order Not Found"});
         }

}))


orderRouter.delete("/:id", isAuth, isAdmin, expressAsyncHandler(async(req,res)=>{
   const order = await Order.findById(req.params.id);

   if(order){
      await order.remove()
      res.send({message: "Order deleted successfully" })
   } else{
      res.status(404).send({message: "Order not found"})
   }
}))


export default orderRouter;