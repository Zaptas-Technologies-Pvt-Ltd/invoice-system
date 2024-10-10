const jwt = require('jsonwebtoken');
require("dotenv").config();

module.exports = (req, res,  next) => {

    try{
        const token = req.headers.authorization.split(" ")[1];
        console.log(process.env.jwt_secret,'ddddddddddd')
       // const token = req.headers.authorization.split(" ")[1];
    if(!token){
        return res.status(401).send({
            message:"Auth Failed!",
            success: false,
        });
    }
    
    const decoded = jwt.verify(token, process.env.jwt_secret);
    req.body.userId = decoded.userId;
    next();
    }catch (error) {
        return res.status(401).send({
            message: "Auth Failed!",
            success: false,
        });
    }

};