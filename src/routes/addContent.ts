import {Router} from 'express'
import {User , Content , Tag} from '../db/db'
import zod from 'zod'
const router = Router();
import authMiddleware from '../middlewares/AuthMiddleware'
import {Request , Response , NextFunction} from 'express'
import mongoose from 'mongoose'

declare module 'express' { 
    export interface Request {
        username?: string;
    }
}


const contentSchema = zod.strictObject({
    type : zod.enum(['image' , 'video' , 'article' , 'audio']) ,
    link : zod.url() ,
    title : zod.string().min(1) ,
    tags : zod.array(zod.string().toLowerCase())
})
interface a {
            _id: mongoose.Schema.Types.ObjectId
        } 


router.post('/' ,authMiddleware ,  async (req:Request ,res:Response)=>{
    try {
        
        const response =contentSchema.safeParse(req.body);
        
        if(! response.success) throw new Error('Zod validation failed')
        // now we have to verify the jwt secret and send the whole body that includes userid to the database
        
        const user =await  User.findOne({username : req.username}) as a;
        if(! user){
            throw new Error('Sign in Again');
        }
        // now converting each Tags to their object id if tag does not exist make one
        let tagarray:mongoose.Schema.Types.ObjectId [] = [];
        for(let i=0;i<response.data.tags.length;i++){
            const str:string = response.data.tags[i] ;
            const TAG=await Tag.findOne({title : str}) as a;
            if(TAG) {
                tagarray.push(TAG._id);
            }
            else{
                const newTAG = await Tag.create({title : str}) as a;
                tagarray.push(newTAG._id);
            }
        }
        await Content.create({
            link : response.data.link ,
            type : response.data.type ,
            title : response.data.title ,
            tags : tagarray ,
            userId : user._id 
        })

        return res.status(200).json({message : "Content Created Successfully"});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message :"Internal Server error"}) ;
    }
    
})

export = router