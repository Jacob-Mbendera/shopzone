import  express  from "express";
import Product from "../models/product.models.js";
import data from "../data/data.js";
import User from "../models/user.models.js";


//creating a route from express.Router()
//SeedRouter is an object from  express.Router() function, used to export data into  MangoDb
const seedRouter = express.Router();
seedRouter.get('/', async (req,res) =>{
    //remove all previous records in the product model
    await Product.remove({});

    //create products      //inserting an array of products into Product model in the Database
    const createProducts = await Product.insertMany(data.products);

    await User.remove({});
    const createdUsers = await User.insertMany(data.users);
    //send to the frontend
    res.send({ createProducts, createdUsers});

})


export default seedRouter;