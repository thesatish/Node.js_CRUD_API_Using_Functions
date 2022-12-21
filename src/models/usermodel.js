const express = require('express');
const mongoose = require('mongoose');


const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        maxlength: [7, "Please enter maximum 7 lenght"],
        minlength: [3, "Please enter minimum 3 lenght"]
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: String,
        required: [true, "User phone number required"],
        min: [10, "Please Enter At lease 10 Digits"],
        max: [12, "Do not enter more than 12 digits"],
    },
    age: {
        type: Number,
        required: true
    },
    course: {
        type: String,
        enum: {
            values: ["bca", "mca", "bsc", "msc"],
            message: `{VALUE} is not supported`
        },
        required: true
    },
    roll: {
        type: Number,
        required: true,
    },

}, { timestamps: true });


const User = new mongoose.model("student", studentSchema);
module.exports = User;

