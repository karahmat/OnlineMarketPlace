const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shopSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: {
            type: String, 
            required: [true, "Please fill in shop name"], 
            unique: true
        },
        description: {
            type: String, 
            trim: true
        },
        address: {
            type: String, 
            required: [true, "Please fill in address"]
        },
        postalcode: {
            type: Number, 
            required: [true, "Please fill in postalcode"]
        },
        contactnumber: {
            type: Number, 
            required: [true, "Please fill in contact number"]
        }, 
        shopimage: {
            type: String,
            required: false
        }
    },     
    {
        timestamps: true
    });

const Shop = mongoose.model('shop', shopSchema);

module.exports = Shop;