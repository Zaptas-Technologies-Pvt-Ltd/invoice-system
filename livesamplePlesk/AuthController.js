var url = require('url');
const { MongoClient, ObjectID } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');
var authdb = require('../model/AuthModel');
require('dotenv').config();
exports.companyDetail = async (req, res) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.jwt_secret);
        const list = await authdb.find({_id:decoded.userId});
        return res.status(200).send({
            success: true,
            message: "Data fatched successfully",
            data: list,
        })

    }catch (error) {
        res.send({
            message: error.message,
            success: false,
            data: null,
        })
    }
}
exports.companyCreate =async  (req , res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }
    const userExit = await authdb.findOne({userName: req.body.userName });
    if(userExit){
        return res.send({
            message: "User Already exit!",
            success: false,
        });
    }else{
    const hashPassword = await bcrypt.hash('12345', 5);
    req.body.password = hashPassword;
    const companyProfile = new authdb({
        userName : req.body.userName,
        password : req.body.password,
        companyName : req.body.companyName,
        companyAddress : req.body.companyAddress,
        companyGST : req.body.companyGST,
        bankName : req.body.bankName,
        accountNumber : req.body.accountNumber,
        ifscCode : req.body.ifscCode
    })
    companyProfile
        .save(companyProfile)
        .then(data => {
            res.status(200).send({
                message : 'Company create successfully',
                success: true,
            });
        })
        .catch(err =>{
            res.status(500).send({
                message : err.message || "Some error occurred while creating a create operation"
            });
        });
    }
}
exports.companyUpdate =async  (req , res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }
    const id = req.params.id;
   // const exitingUser = authdb.findOne({email: req.body.userName });
   //const hashPassword = await bcrypt.hash(req.body.password, 5);
   // req.body.password = hashPassword;
    // const token = req.body.id.split(" ")[1];
    // const decoded = jwt.verify(token, process.env.jwt_secret);
    // const id = decoded.userId;
    if(id){
        authdb
        .update({ _id: ObjectID(id)}, { 
            userName : req.body.userName,
            //password : req.body.password,
            companyName : req.body.companyName,
            companyAddress : req.body.companyAddress,
            companyGST : req.body.companyGST,
            bankName : req.body.bankName,
            accountNumber : req.body.accountNumber,
            ifscCode : req.body.ifscCode
        })
        .then(data => {
            res.status(200).send({
                message : 'Company Update successfully',
                success: true,
            });
        })
        .catch(err =>{
            res.status(500).send({
                message : err.message || "Some error occurred while creating a create operation",
                success: false,
            });
        });
    }
}
/// Login ............../
exports.login = async (req , res)=>{
    try{
        const userExit = await authdb.findOne({userName: req.body.userName });
        if(!userExit){
            return res.send({
                message: "User don't exit",
                success: false,
                data: null,
            });
        }
        if(userExit.isBlocked){
            return res.send({
                message: "your account is blocked please contact to admin",
                success: false,
                data: null,
            });
        }
        const passwordMatch =await bcrypt.compare(req.body.password, userExit.password);
        if(!passwordMatch){
           return res.send({
                message: "Incorrect Password",
                success: false,
                data: null,
            });
        }
       const token =jwt.sign(
            { userId: userExit._id },process.env.jwt_secret,
            {expiresIn: '1day'}
       );
       res.send ({
          message: "User Logged In Successfully!",
          success: true,
          data: token,
       })
    }catch (error) { 
        res.send({
            message: error.message,
            success: false,
            data: null,
        });
    }

}

// update password
exports.passwordUpdate = async (req , res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }
    const id = req.params.id;
    const userExit = await authdb.findOne({_id: ObjectID(id) });
    const passwordMatch =await bcrypt.compare(req.body.password, userExit.password);
    if(!passwordMatch){
        return res.send({
            success: false,
            message: "Incorrect OLD Password",
        });
    }else{
        const haspassword = await bcrypt.hash(req.body.newpassword, 5);
        authdb.update({ _id: ObjectID(id)}, { 
            password : haspassword,
        }).then(data => {
                res.status(200).send({
                    success: true,
                    message : 'Password update successfully'
                });
            })
            .catch(err =>{
                res.status(500).send({
                    success: false,
                    message : err.message || "Some error occurred while creating a create operation"
                });
            });
    }
  

}