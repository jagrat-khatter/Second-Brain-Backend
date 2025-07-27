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

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/v1/signup' , signupRouter) ;
app.use('/api/v1/signin' , signinRouter) ;
app.use('/api/v1/addContent' , addContentRouter) ;
app.use('/api/v1/getContent' , getContentRouter) ;
app.use('/api/v1/delete' , deleteRouter);
app.use('/api/v1/share' , shareRouter)

app.listen(PORT , ()=>{
    console.log(`App is listening on port ${PORT}`) ;
})