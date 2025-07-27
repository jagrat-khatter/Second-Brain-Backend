import express from 'express'
import Router from 'express'
import jwt from 'jsonwebtoken'
import authMiddleware from '../middlewares/AuthMiddleware'


const router = Router();

router.get('/' , authMiddleware, async (req , res)=>{
    try 
    {

    }
    catch(err){
        
    }
})