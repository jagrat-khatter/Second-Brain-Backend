import express from 'express'
import Router from 'express'
import jwt from 'jsonwebtoken'
import authMiddleware from '../middlewares/AuthMiddleware'
import {JWT_secrets} from '../config'
import {User , Content,Tag } from '../db/db'

const router = Router();

// you're absolutely sure that a property exists on an object, you can use the non-null assertion 
// operator (!) to tell TypeScript to bypass null/undefined checks.
// else might prefer to create or extend an interface or use type guards.
interface c {
    username? : string
}

router.get('/:shareLink' , authMiddleware, async (req , res)=>{
    try 
    {
        const {shareLink} = req.params;
        const response = jwt.verify(shareLink , JWT_secrets) as c;
        // jwt.verify is typed to return a union (string | JwtPayload), and a plain string doesn't have 
        // a username property.

        // if this has passed means this has original hash created by us
        // since there is no option of deleting the account we can make sure that account always 
        // exist with username

        const username = response.username;

        const user =await  User.findOne({username : username});
        let array  =await Content.find({userId : user!._id});
        // using an async function in your array.map callback, which returns promises. When you use async 
        // functions, the result is always wrapped in a Promise
        let finalarray =await Promise.all (array.map(async (x)=>{
            let tagArray : string[] = [];
            for(let i=0;i<x.tags.length;i++){
                const tag =await Tag.findOne({_id : x.tags[i]});
                if(tag!.title) tagArray.push(tag!.title);
            }
            return ({
                id : x._id ,
                type : x.type ,
                link : x.link ,
                title : x.title ,
                tags : tagArray 
            })
        }))

        return res.status(200).json(finalarray);

    } 
    catch(err){
        
        if(err instanceof Error){
            if(err.name === 'TokenExpiredError') return res.status(403).json({
                message : "Token has expired"
            })
            else if(err.name === "JsonWebTokenError") return res.status(403).json({
                message : "Invalid Token"
            })
        }
        return res.status(500).json({message : "failed"});
    }
})


export = router