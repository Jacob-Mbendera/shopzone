import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    name: {type: String, required: true},
    comment: {type: String, required: true},
    rating: {type: Number, required: true},
},{
    timestamps: true    ,
})
//mongoose schema accepts an object and options
const productSchema = new mongoose.Schema(
    {
        name: {type: String, require: true, unique: true},
        slug:  {type: String, require: true, unique: true} ,
        image: {type: String, require: true},
        images: [String],
        brand: {type: String, require: true},
        category: {type: String, require: true},
        description: {type: String, require: true},
        price: {type: Number, require: true},
        countInStock: {type: Number, require: true},
        rating: {type: Number, require: true},
        numReviews: {type: Number, require: true},
        reviews: [reviewSchema]
    },
    //options
    {
        timestamps: true,
    }
)

//creating a model based on the schema
const Product = mongoose.model("Product", productSchema); 

export default Product;