import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({

    orderItems:[
        {

            slug:  {type: String, require: true} ,
            name: {type: String, require: true},
            quantity: {type: Number, require: true},
            image: {type: String, require: true},
            price: {type: Number, require: true},
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', 
                required: true,
            },
        }
    ],


    shippingAddress:{
        fullName:  {type: String, require: true} ,
        address:  {type: String, require: true} ,
        city:  {type: String, require: true} ,
        postalCode:  {type: String, require: true} ,
        country:  {type: String, require: true} ,
        location:{
            lat:{ Number },
            lng:{ Number },
            address:{ String },
            name:{ String },
            vicinity:{ String },
            googleAddressId:{ String },
        },
    },

    paymentMethod:  {type: String, require: true} ,
    paymentResult:{
        id:{ type: String},
        status:{ type: String},
        update_time:{ type: String},
        email_address:{ type: String},
    },

    itemsPrice: {type: Number, require: true},
    shippingPrice: {type: Number, require: true},
    taxPrice: {type: Number, require: true},
    totalPrice: {type: Number, require: true},

    user:{
        type: mongoose.Schema.Types.ObjectId, ref:"User", required: true
    },


    isPaid: {type: Boolean, default: false},
    paidAt: {type: Date},
    isDelivered: {type: Boolean, default: false},
    deliveredAt: {type: Date},


},
{
    timestamps: true
}
)

const Order = mongoose.model("Order", orderSchema);

export default Order;