require("dotenv").config();
const jwt = require("jsonwebtoken");

const tokenVerification = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["authorization"];
    if (!token) {
        res.status(200).send({ success: false, msg: "Token Required" });
    }
    try {
        const descode = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
        res.status(400).send("The Token is Wrong");
    }
    return next();
}

module.exports = tokenVerification;