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
        // Mongoose's populate method lets you automatically replace a referenced ObjectId with the actual 
        // document. For example, if your Content schema has a field like:
        // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        // and you execute a query with populating:
        // Content.find({ userId: user._id }).populate('userId');
        // Mongoose fetches the corresponding User document for each Content document and replaces the 
        // userId field with an object
        // How it know to that it should get the object from "User" model we'll we have done ref:'User' 
        // in userId key in Content
        // If we dont want the complete object corresponding to userId then we can do ('userId' , 'username')
        // bcoz the complete user object will have password , share status also
        let array  =await Content.find({userId : user._id}).populate('userId' );
        // console.log(array);
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
                username : username ,
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