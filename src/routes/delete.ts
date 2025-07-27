import {Router} from 'express'
import {User , Content , Tag} from '../db/db'
const router = Router();
import authMiddleware from '../middlewares/AuthMiddleware'
import {Request , Response , NextFunction} from 'express'
import mongoose from 'mongoose'
interface a {
    userId?: string
}
interface b {
    username?: string
}



router.delete('/' ,authMiddleware , async (req:Request , res:Response)=>{
    try{
        const username = req.username ;
        const user = await User.findOne({username : username});
        const contentId:number = parseInt(req.body.contentId) ;
        // if the frontend calls for content with respect to a user how will they be displayed 
        let array:any[]=[];
        if(user) array = await Content.find({userId : user._id});
        
        if(contentId > array.length){
            throw new Error("Trying to delete a doc you don't own");
        }
        const id = array[contentId-1]._id;
        await Content.deleteOne({_id : id});
        return res.status(200).json({message : "Delete succeeded"});
    }
    catch(err){
        if(err instanceof Error){
            if(err.message === "Trying to delete a doc you don't own")
                return res.status(403).json({message : "Trying to delete a doc you don't own"})
        }
        return res.status(500).json({message : "Internal Server error"});
    }
})

export = router;