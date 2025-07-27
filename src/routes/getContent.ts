import {Router} from 'express'
import {User , Content , Tag} from '../db/db'
const router = Router();
import authMiddleware from '../middlewares/AuthMiddleware'
import {Request , Response , NextFunction} from 'express'
import mongoose from 'mongoose'
interface a {
            _id?: mongoose.Schema.Types.ObjectId
        } 
interface b {
            title?: string
        } 
router.get('/' , authMiddleware ,async (req:Request , res:Response)=>{
    try {
        const username = req.username ;
        const user =await  User.findOne({username : username}) as a;
        let array  =await Content.find({userId : user._id});
        // using an async function in your array.map callback, which returns promises. When you use async 
        // functions, the result is always wrapped in a Promise
        let finalarray =await Promise.all (array.map(async (x)=>{
            let tagArray : string[] = [];
            for(let i=0;i<x.tags.length;i++){
                const tag =await Tag.findOne({_id : x.tags[i]}) as b;
                if(tag.title) tagArray.push(tag.title);
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
        console.log(err);
        return res.status(500).json({message :"Internal Server Error"});
    }
})

export = router