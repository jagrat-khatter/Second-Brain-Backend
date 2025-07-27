import express from 'express'
import Router from 'express'
import {User , Content , Tag , Link} from '../db/db'
const router = Router();
import authMiddleware from '../middlewares/AuthMiddleware'
import {Request , Response} from 'express'
import jwt from 'jsonwebtoken'
import {JWT_secrets} from '../config'
interface a {
    _id? : string
}

router.post('/' , authMiddleware , async (req:Request , res:Response)=>{
    try{
        const username = req.username;
        const user = User.findOne({username : username}) as a;
        const userId = user._id;
        if(req.body.share == true){
            let hash ;
            await User.updateOne({username : username} , {share : true});
            const links = await Link.findOne({userId : userId});
            if(links) hash = links.hash;
            else {
                hash = jwt.sign({username : username} , JWT_secrets);
            }
            return res.status(200).json({link : hash});
        }
        else {
            await User.updateOne({username : username} , {share : false});
            return res.status(200).json({message : "Sharing is off"});
        }
    }  
    catch(err){

    }
})
export = router