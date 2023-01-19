import express from 'express';
import data from './data/data.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seed.routes.js';
import productRouter from './routes/products.routes.js';
import userRouter from './routes/users.routes.js';
import morgan from 'morgan';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then( () =>{
    console.log("Connected to the Database")
})
.catch((error) =>{
    console.log(error.message);
});


const app = express();

//the data in POST Request will be converted to a JSON object in record body
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan("dev"))

//APIs
app.use('/api/seed/', seedRouter)
app.use('/api/products', productRouter);
app.use('/api/products/slug/:slug', productRouter);
app.use('/api/products/:id', productRouter);
app.use('/api/users/', userRouter);


//error handler for express
app.use((err, req, res, next) =>{
    res.status(500).send({message: err.message});
})

const port = process.env.PORT || 5001;

app.listen(port, () =>{
    console.log(`server running at https://localhost:${port}`);
})
