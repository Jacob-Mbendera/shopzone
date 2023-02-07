import mongoose from "mongoose";
//mongoose schema accepts an object and options
const productSchema = new mongoose.Schema(
    {
        name: {type: String, require: true, unique: true},
        slug:  {type: String, require: true, unique: true} ,
        image: {type: String, require: true},
        brand: {type: String, require: true},
        category: {type: String, require: true},
        description: {type: String, require: true},
        price: {type: Number, require: true},
        countInStock: {type: Number, require: true},
        rating: {type: Number, require: true},
        numReviews: {type: Number, require: true},
    },
    //options
    {
        timestamps: true,
    }
)

//creating a model based on the schema
const Product = mongoose.model("Product", productSchema); 

export default Product;