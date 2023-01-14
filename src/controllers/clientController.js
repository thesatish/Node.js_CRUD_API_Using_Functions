require("dotenv").config();
const Client = require("../models/clientModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");


//Email Link to Reset Password
const resetMailLink = async (name, email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.RESET_EMAIL,
                pass: process.env.RESET_EMAIL_PASSWORD
            }
        });

        const mailData = {
            from: process.env.RESET_EMAIL,
            to: email,
            subject: 'Reset Your Password',
            html: '<p> Dear ' + name + ', To Reset Your Password, Please <a href="http://127.0.0.1:3000/api/client/reset-password?token=' + token + '"> Click Here</a>'
        }
        transporter.sendMail(mailData, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log("Mail has been sent:- ", info.response);
            }
        });

    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }

}


//Generate Token
const generateToken = async (id) => {
    try {
        const token = await jwt.sign({ _id: id }, process.env.SECRET_KEY);
        return token;
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//Hashing Password
const privatePassword = async (password) => {
    try {
        const hashPass = await bcryptjs.hash(password, 10);
        return hashPass;
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//Client Register
const client_register = async (req, res) => {
    try {
        const savePass = await privatePassword(req.body.password);
        const clientInsert = new Client({
            name: req.body.name,
            email: req.body.email,
            password: savePass,
            mobile: req.body.mobile,
            image: req.file.filename,
            admin: req.body.admin
        });

        const clientData = await Client.findOne({ email: req.body.email });
        if (clientData) {
            res.status(200).send({ success: false, msg: "Email Already Exists" });
        }
        else {
            const Client_data = await clientInsert.save();
            res.status(200).send({ success: true, data: Client_data });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }

}

//Client Login
const client_login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const clientData = await Client.findOne({ email: email });
        // console.log(clientData);
        if (clientData) {
            const truePassword = await bcryptjs.compare(password, clientData.password);
            if (truePassword) {
                const tokenData = await generateToken(clientData._id);
                const ClientResult = {
                    _id: clientData._id,
                    name: clientData.name,
                    email: clientData.email,
                    password: clientData.password,
                    image: clientData.image,
                    mobile: clientData.mobile,
                    admin: clientData.admin,
                    token: tokenData
                }
                const response = {
                    success: true,
                    msg: "Client Details",
                    data: ClientResult
                }
                res.status(200).send(response);
            }
            else {
                res.status(200).send({ success: false, msg: "Wrong Credential..." });
            }
        }
        else {
            res.status(200).send({ success: false, msg: "Wrong Credential" });
        }

    } catch (error) {
        res.status(400).send(error.message);
    }
}

//Update Password
const client_password_update = async (req, res) => {
    try {
        const _id = req.body._id;
        const password = req.body.password;
        const data = await Client.findOne({ _id });
        if (data) {
            const newPassword = await privatePassword(password);
            const clientData = await Client.findByIdAndUpdate({ _id }, {
                $set: {
                    password: newPassword
                }
            });
            res.status(200).send({ success: true, msg: "Password Updated Successfully" });
        }
        else {
            res.status(200).send({ success: false, msg: "Client Id Invalid" });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}


//Forget Password
const client_password_forget = async (req, res) => {
    try {
        const email = req.body.email;
        const clientData = await Client.findOne({ email: email });
        if (clientData) {
            const randomString = randomstring.generate();
            const data = await Client.updateOne({ email: email }, { $set: { token: randomString } });
            resetMailLink(clientData.name, clientData.email, randomString);
            res.status(200).send({ success: true, msg: "Please Check Out Your Email" });
        }
        else {
            res.status(200).send({ success: true, msg: "Email ID does not exist." });
        }

    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

//Reset Password
const client_password_reset = async (req, res) => {
    try {
        const token = req.query.token;
        const tokenData = await Client.findOne({ token: token });
        if (tokenData) {
            const password = req.body.password;
            const newPassword = await privatePassword(password);
            const clientData = await Client.findByIdAndUpdate({ _id: tokenData._id }, { $set: { password: newPassword, token: '' } }, { new: true });
            res.status(200).send({ success: true, msg: "Client Password Has Been Reset", data: clientData });
        }
        else {
            res.status(200).send({ success: true, msg: "Expired Link." });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}


module.exports = {
    client_register,
    client_login,
    client_password_update,
    client_password_forget,
    client_password_reset,
}