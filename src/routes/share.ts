import express from 'express'
import Router from 'express'
import {User , Content , Tag , Link} from '../db/db'
const router = Router();
import authMiddleware from '../middlewares/AuthMiddleware'
import {Request , Response} from 'express'
import jwt from 'jsonwebtoken'
import {JWT_secrets} from '../config'
import zod from 'zod'

const shareSchema = zod.strictObject({
    share : zod.boolean()
})

router.post('/' , authMiddleware , async (req:Request , res:Response)=>{
    try{
        const username = req.username; 
        const response =  shareSchema.safeParse(req.body);
        if(!response.success) throw new Error('Zod validation failed')
        const user =await User.findOne({username : username});
        const userId = user!._id;
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
        return res.status(500).json({message : "Internal server error"});
    }
})
export = router

// Another model could be creating a random hash
// If user gives true , then we create a hash , and attach it with username or userId 
// when someone gets this hash you search for that hash and then get its username and access content
// When owner sends share:false we'll delete that hash associated with that username or userId
// if some user tries to access someone else's content with their hash when share:false by 
// bcoz the hash has been deleted so that hash will not find association with any user 
// evertime user does share:false the hash gets revoked now even if share:true happens by owner
// he has to give a new hash to all its followers