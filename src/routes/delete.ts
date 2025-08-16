import {Router} from 'express'
import {User , Content , Tag} from '../db/db'
const router = Router();
import authMiddleware from '../middlewares/AuthMiddleware'
import {Request , Response , NextFunction} from 'express'
import mongoose from 'mongoose'


router.delete('/' ,authMiddleware , async (req:Request , res:Response)=>{
    try{
        const username = req.username ;
        const user = await User.findOne({username : username});
        const contentId:string = req.body.contentId ;
        if (!contentId || !mongoose.Types.ObjectId.isValid(contentId)) {
            return res.status(400).json({message: "Invalid content ID"});
}
        // if the frontend calls for content with respect to a user how will they be displayed 
        let content=null;
        if(user) content = await Content.findOne({userId : user._id , _id : contentId});
        
        if(!content){
            throw new Error("Trying to delete a doc you don't own");
        }
        await Content.deleteOne({_id : contentId});
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