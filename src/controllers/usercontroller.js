const User = require('../models/usermodel');

//creating student data
const store_student = async (req, res) => {
    try {
        const addingStdData = new User(req.body);
        const newInsert = await addingStdData.save();
        res.status(201).send(newInsert);
    } catch (e) {
        res.status(400).send(e);
    }
}

//fetching all students data
const fetch_all_students = async(req, res) => {
    try{
        const fetch = await User.find({});
        res.status(200).send(fetch);
    }catch(err){
        res.status(500).send(err);
    }
}

//Fetching Single student data
const single_student = async(req, res) => {
    try{
        const _id = req.params.id;
        const fetch = await User.findById(_id)
        res.status(200).send(fetch);
    }catch(err){
        res.status(500).send(err);
    }
}

//update student data
const update_student = async(req, res) =>{
    try{

        const _id = req.params.id;
        const update = await User.findByIdAndUpdate(_id, req.body, {new: true});
        res.status(200).send(update);
    }catch(err){
        res.status(500).send(err);
    }
}

//delete student data
const delete_student = async(req, res) => {
    try{
        const _id = req.params.id;
        const deletes = await User.findByIdAndDelete(_id);
        res.status(200).send(deletes);
    }catch(err){
        res.status(500).send(err);
    }
}


module.exports = { store_student, fetch_all_students, single_student, update_student, delete_student }
