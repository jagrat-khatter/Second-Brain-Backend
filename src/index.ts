import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import zod from 'zod'
import cors from 'cors'
import signupRouter from './routes/signup'
import signinRouter from './routes/signin'
import addContentRouter from './routes/addContent'
import getContentRouter from './routes/getContent'
import deleteRouter from './routes/delete'
import shareRouter from './routes/share'
import sharedContentRouter from './routes/sharedContent'
import {Request , Response , NextFunction} from 'express'

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/v1/signup' , signupRouter) ;
app.use('/api/v1/signin' , signinRouter) ;
app.use('/api/v1/addContent' , addContentRouter) ;
app.use('/api/v1/getContent' , getContentRouter) ;
app.use('/api/v1/delete' , deleteRouter) ;
app.use('/api/v1/share' , shareRouter) ;
app.use('/api/v1/brain' , sharedContentRouter) ;

app.listen(PORT , ()=>{
    console.log(`App is listening on port ${PORT}`) ;
})
// special middleware 
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json({ message: "Invalid JSON" });
    }
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
});

// If an error is next(err)'d or thrown inside the routeHandler, Express looks ahead for the first 
// error-handling middleware (i.e., a function with 4 args: err, req, res, next)