import express, { query }  from "express";
import expressAsyncHandler from "express-async-handler";
import Product from "../models/product.models.js";
import { isAdmin, isAuth } from "../utils.js";
const productRouter = express.Router();

productRouter.get('/', async (req, res) =>{

    const products = await Product.find();
    res.send(products);
});

productRouter.post("/", isAuth, isAdmin, expressAsyncHandler(async(req,res)=>{
    const newProduct =  new Product({
        name: "Sample Name" + Date.now(),
        slug: "Sample Name" + Date.now(),
        image:  "/images/p1.jpg",
        brand:  "Sample Brand",
        category: "Sample Category",
        description:  "Sample Description",
        price: 0,
        countInStock: 0,
        rating: 0,
        numReviews: 0,
    });

    const product = await newProduct.save();
    res.send({ message: "Product Created",  product});
})
)

const PAGE_SIZE = 3;

productRouter.get("/admin", isAuth,isAdmin, expressAsyncHandler(async(req,res)=>{

    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;
 
    const products = await Product.find().skip(pageSize * (page - 1)).limit(pageSize);
 
    const countDocuments = await Product.countDocuments();
    res.send({
        products, 
        countDocuments, 
        page, 
        pages: Math.ceil(countDocuments / pageSize) })
    
 
 }));
productRouter.get('/search', expressAsyncHandler(async(req,res)=>{
    
        const { query }  = req;
        //get these from the query string
        const pageSize = query.pageSize || PAGE_SIZE;
        const page = query.page || 1;
        const category = query.category || '';
        const brand = query.brand || '';
        const price = query.price || '';
        const rating = query.rating || '';
        const order = query.order || '';
        const searchQuery = query.query || ''; //query string; searches for words that match 

        //if query is not equal to 'all'; set searchQuery to the object or else set it to an empty object
        const queryFilter = searchQuery && searchQuery !== 'all' ? {
            name: {
                $regex: searchQuery,
                $options: 'i' //case insensitive
            }
        } : 
        {};

        const  categoryFilter = category && category !=='all' ? {category} : {};
        const  ratingFilter = rating && rating !=="all" ? {
            rating:{
                $gte: Number(rating)
            },
        } : {};

        const priceFilter = price && price  !=='all' ? {
            price: {
                //e.g  range 1-50
                $gte: Number(price.split("-"[0])),
                $lte: Number(price.split("-"[1]))
            }
        } : {};
        const sortOrder = 
        order ==="featured" 
        ?{featured: -1}
        :order==="lowest"
        ?{price: 1}
        :order==="highest"
        ?{price: -1} //reverse
        :order==="toprated"
        ?{rating: -1}
        :order==="newest"
        ?{createdAt: -1}
        :{_id: -1}

        //passing the filters to Product
        const products = await Product.find({
            ...queryFilter,
            ...categoryFilter,
            ...priceFilter,
            ...ratingFilter
        }).sort(sortOrder)
            .skip(pageSize * (page - 1))
            .limit(pageSize)

        const countProducts = await Product.countDocuments({
            ...queryFilter,
            ...categoryFilter,
            ...priceFilter,
            ...ratingFilter
        });

        res.send({
            products,
            countProducts,
            page,
            pages: Math.ceil(countProducts /  pageSize),
        });
    }
    
))


productRouter.get('/categories', expressAsyncHandler(async(req,res)=>{
    const categories = await Product.find().distinct('category');
    res.send(categories);

}))

productRouter.get('/slug/:slug', async(req,res) =>{
    const product = await Product.findOne({slug: req.params.slug});

    if(product){
        res.send(product);
    }
    else{
        res.status(404).send({message:"product not found"});
    }
})


productRouter.get('/:id', async(req, res) =>{
    const product = await Product.findById(req.params.id);

    if(product){
        res.send(product);
    } else{
        res.status(404).send( {message: "Product Not Found"});
    }
})




export default productRouter;
