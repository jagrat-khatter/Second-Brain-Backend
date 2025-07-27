import express from 'express'
import {Router} from 'express'
import {User} from '../db/db'
import zod from 'zod'

const router = Router();
//z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/);

const userSchema = zod.object({
    username : zod.string().min(3).lowercase().trim() ,
    password : zod.string().min(3).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/)
})
// if zod does not validate the password properly mongoose validator will throw Error message 
// User validation failed: password: Path `password` (`123123`) is shorter than the minimum allowed length (8).
// it is recommended to make one thing as you primary validator zod is easy and reasonable 
// mongoose acts a double check so that our db remains refined 

router.post('/' ,async (req , res)=>{
    try{   
        
        const body = req.body ;
        const response = userSchema.safeParse(body) ;
        const user = await User.findOne({username : body.username}) ;
        if(!!user) {
            throw new Error('Username already taken');
        }
        if(!response.success){
            throw new Error('Zod validation failed');
        }
        await User.create(body) ;
        return res.status(200).json({message : "User successfully created!"})
    }
    catch(err){
        if(err instanceof Error){
            if(err.message === "Username already taken") 
                return res.status(403).json({message : "User already exists with this username"});
            else if(err.message === 'Zod validation failed')
                return res.status(411).json({message : "Error in inputs"});
        }
            console.log("An unexpected error occurred", err);
        
        return res.status(500).json({message: "Internal Server Error"});
    }

})

export default router;