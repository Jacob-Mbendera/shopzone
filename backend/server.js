import express from 'express'; 
import data from './data/data.js';

const app =  express();

app.get('/api/products', (req,res)=>{
    res.send(data.products);
});

const port = process.env.PORT || 5001   ;


app.listen(port, ()=>{
    console.log(`Listening at http://localhost:${port}`);
});