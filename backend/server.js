import express from 'express';
import data from './data/data.js';


const app = express();

app.get('/api/products', (req,res) =>{
    res.send(data.products);
})

const port = process.env.port || 5001;

app.listen(port, () =>{
    console.log(`server running at https://localhost:${port}`);
})
