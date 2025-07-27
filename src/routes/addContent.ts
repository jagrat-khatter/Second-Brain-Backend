import {Router} from 'express'
import {User , Content , Tag} from '../db/db'
import zod from 'zod'
import jwt from 'jsonwebtoken'
const router = Router();

const contentSchema = zod.object({
    type : zod.literal(['document' , 'tweet' , 'youtube' , 'link']);
    link : zod.string().startsWith("https://");
    
})

router.post('/' , async (req , res)=>{
    try {
        
    }
    catch(err){

    }
    
})