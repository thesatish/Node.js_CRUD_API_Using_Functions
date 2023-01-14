const express = require("express");
const clientRoute = express();
const clientController = require("../controllers/clientController");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
clientRoute.use(express.static('public'));


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/client'), function (error, sucess) {
            if (error) throw error
        });
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name, function (error1, success1) {
            if (error1) throw error1
        })
    }
});

const upload = multer({ storage: storage });


clientRoute.post('/register', upload.single('image'), clientController.client_register);
clientRoute.post('/login', clientController.client_login);
clientRoute.post('/update-password', auth, clientController.client_password_update);
clientRoute.post('/forget-password', clientController.client_password_forget);
clientRoute.post('/reset-password', clientController.client_password_reset);

//test
clientRoute.get('/test', auth, function (req, res) {
    res.status(200).send({ success: true, msg: "Secured API" })
});




module.exports = clientRoute;