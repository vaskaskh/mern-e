import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/utils.js';
import {isAuth} from '../utils/utils.js';


const router = express.Router();

router.get('/seed',expressAsyncHandler(async(req,res)=>{
    // await User.remove({});

    const createdUsers = await User.insertMany(data.users);
    res.send({createdUsers});

})
);

router.post('/signin', expressAsyncHandler(async(req,res)=>{
    const user = await User.findOne({email: req.body.email});
    if(user){
        if(bcrypt.compareSync(req.body.password, user.password)){
            res.send({
                _id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user)
            });
return;
        }

    }
    res.status(401).send({message:"Invalid email or password "})
}))


router.post("/register",expressAsyncHandler(async(req,res)=>{
        const {name, email} = req.body
    const user = new User({
        name, 
        email, 
        password: bcrypt.hashSync(req.body.password, 8)
    })
    
    const createdUser = await user.save();

    if(createdUser){
        res.send({
            _id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            isAdmin: createdUser.isAdmin,
            token: generateToken(createdUser)
        })
    }
}));



router.get("/:id", expressAsyncHandler(async(req,res)=>{
    const user = await User.findById(req.params.id);
    if(user){
        res.send(user)
    }else{
        res.status(404).send({message: 'User Not Found'})
    }
}));


router.put("/profile",isAuth, expressAsyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id);

    if(user){
        user.name= req.body.name || user.name;

        user.email= req.body.email || user.email;;

        if(req.body.password){
            user.password = bcrypt.hashSync(req.body.password, 8)
        }
        const updatedUser = await user.save();

        res.send({
            _id: updatedUser._id,

            name: updatedUser.name,

            email: updatedUser.email,

            isAdmin: updatedUser.isAdmin,

            token: generateToken(updatedUser),
        })
    }
}))


export default router;