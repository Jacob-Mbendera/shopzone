import express from 'express';
import path from 'path'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seed.routes.js';
import productRouter from './routes/products.routes.js';
import userRouter from './routes/users.routes.js';
import morgan from 'morgan';
import orderRouter from './routes/order.routes.js';
import uploadRouter from './routes/upload.routes.js';

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
app.use(morgan("dev"));
app.use('/api/keys/paypal', (req, res)=>{
    res.send(process.env.PAYPAL_CLIENT_ID || 'sb'); //if PAYPAL_CLIENT_ID doesnt exist return sand box
});
app.get('/api/keys/google', (req, res) => {
    res.send({ key: process.env.GOOGLE_API_KEY || '' });
});

//APIs
app.use('/api/seed/', seedRouter)
app.use('/api/upload/', uploadRouter)
app.use('/api/products', productRouter);
app.use('/api/users/', userRouter);
app.use('/api/orders/', orderRouter);

//returns the currrent directory 
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
);

//error handler for express
//works a middleware
app.use((err, req, res, next) =>{
    res.status(500).send({message: err.message});
})

const port = process.env.PORT || 5001;

app.listen(port, () =>{
    console.log(`server running at https://localhost:${port}`);
})
