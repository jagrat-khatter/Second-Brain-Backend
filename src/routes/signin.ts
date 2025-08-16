import express from 'express'

import {Router} from 'express'
import {User} from '../db/db'
import jwt from 'jsonwebtoken'
import {JWT_secrets} from '../config'


const router = Router();

router.post('/' ,async (req , res)=>{
    try { 
        
        const body = req.body;
        
        const user = await User.findOne({username : body.username , password : body.password});
       
        if(!user){
            throw new Error('Invalid Credentials');
        }
        const token:string  =jwt.sign({username : body.username} , JWT_secrets ,{ expiresIn : "36h"});
        return res.status(200).json({
            token : token 
        })
    }
    catch(err){
        console.log(err);
        if(err instanceof Error){
            if(err.message === 'Invalid Credentials') 
                return res.status(403).json({message : 'Invalid Credentials'});
        }
        return res.status(500).json({message : "Internal Server Error"})
    }
})

export default router;