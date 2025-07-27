import {Request , Response , NextFunction} from 'express'
import jwt , {JwtPayload} from 'jsonwebtoken'
import {JWT_secrets} from '../config'

interface CustomJwtPayload extends JwtPayload{
    username : string 
}

// i have installed @types/express but that takes care by automatically applying types to parameters in 
// route handlers but sometimes it expects to explicitly define them
const authMiddleware = (req:Request , res:Response , next:NextFunction)=>{
    try{const authHeader = req.headers.authorization ;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new Error('authorization error')
    }
    const actualToken = authHeader.slice(7 , authHeader.length);
    const status  = jwt.verify(actualToken , JWT_secrets) as CustomJwtPayload;
    console.log(status);
    req.username = status.username ;
    next();}
    catch(err){
        if(err instanceof Error){
            if(err.message === 'authorization error') {
                return res.status(401).json({message : "Authorization Error"})
            }
            else if(err.name === 'TokenExpiredError') return res.status(403).json({
            message : "Token has expired"
            })
            else if(err.name === "JsonWebTokenError") return res.status(403).json({
                message : "Invalid Token"
            })
        }

        return res.status(500).json({message : "Internal server error"})
    }
}
export  = authMiddleware