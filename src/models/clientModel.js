const mongoose = require("mongoose");

const clientSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    admin:{
        type:Number,
        required:true
    },
    token:{
        type:String,
        default:''
    }

});

const Client = mongoose.model("client", clientSchema);
module.exports = Client;