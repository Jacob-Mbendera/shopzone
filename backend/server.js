import express from 'express';
import data from './data/data.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seed.routes.js';
import productRouter from './routes/products.routes.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then( () =>{
    console.log("Connected to the Database")
})
.catch((error) =>{
    console.log(error.message);
});


const app = express();

app.use('/api/seed', seedRouter)



/*
app.get('/api/products', (req,res) =>{
    res.send(data.products);
}); */

app.use('/api/products', productRouter);

/*
app.get('/api/products/slug/:slug', (req,res) =>{
    const product =  data.products.find((x) => x.slug === req.params.slug);

    if(product){
        res.send(product);
    } else{
        res.status(404).send({ message:'Product now found' });
    }
});
*/

app.use('/api/products/slug/:slug', productRouter);

/*
app.get('/api/products/:id', (req,res) =>{
    const product =  data.products.find((x) => x._id === req.params.id);

    if(product){
        res.send(product);
    } else{
        res.status(404).send({ message:'Product now found' });
    }
}); 
*/
app.use('/api/products/:id', productRouter);

const port = process.env.PORT || 5001;

app.listen(port, () =>{
    console.log(`server running at https://localhost:${port}`);
})
