const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
    {        
        shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop'},
        name: { type: String, required: [true, "Title cannot be blank"] },
        price: { type: Number, required: [true, "Price cannot be blank"] },
        description: { type: String, required: false },
        category: { type: String, required: [true, "Category cannot be blank"]},
        image: { type: String, required: false },
        quantity: { type: Number, required: [true, 'Quantity cannot be blank'] },
        rating: {
            rate: { type: Number, required: false},
            count: { type: Number, required: false},
        }
    },  
    {timestamps: true}
);

const Product = mongoose.model('product', productSchema);

module.exports = Product;
