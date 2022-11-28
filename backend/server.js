import express from 'express';
import data from './data/data.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then( () =>{
    console.log("Connected to the Database")
})
.catch((error) =>{
    console.log(error.message);
});


const app = express();

app.get('/api/products', (req,res) =>{
    res.send(data.products);
});

app.get('/api/products/slug/:slug', (req,res) =>{
    const product =  data.products.find((x) => x.slug === req.params.slug);

    if(product){
        res.send(product);
    } else{
        res.status(404).send({ message:'Product now found' });
    }
});

app.get('/api/products/:id', (req,res) =>{
    const product =  data.products.find((x) => x._id === req.params.id);

    if(product){
        res.send(product);
    } else{
        res.status(404).send({ message:'Product now found' });
    }
});

const port = process.env.PORT || 5001;

app.listen(port, () =>{
    console.log(`server running at https://localhost:${port}`);
})
