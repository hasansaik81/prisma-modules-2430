import { date } from "better-auth/*";
import { Request, Response } from "express";

export function notFond(req:Request,res:Response){
    res.status(400).json({
        message:"Route not found",
        path:req.originalUrl,
        date:Date()
    })
}