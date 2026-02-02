import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(err:any,req:Request,res:Response,next:NextFunction){
    let statusCode=500;
    let errorMessage="Internal server Error";
    let errorDetails=err;
     // PrismaClientValidationError

    if(err instanceof Prisma.PrismaClientValidationError){
      statusCode=400;
      errorMessage="you porvide incorrect fiel type or missing field"
    }

     // PrismaClientKnownRequestError
     if(err instanceof Prisma.PrismaClientKnownRequestError){
        if(err.code==="P2025"){
            statusCode=400;
            errorMessage="An operation failed because it depends on or more records that were dequired but not found."

        }
        else if (err.code==="P2002"){
            statusCode=400;
            errorMessage="Duplicte key errro"
        }

        else if(err.code==="P2003"){
            statusCode=400;
            errorMessage="Foreign key constraint failec"
        }

     }
     else if(err instanceof Prisma.PrismaClientUnknownRequestError){
        statusCode=500;
        errorMessage="Error occurred  during query execution"
     }
     else if(err instanceof Prisma.PrismaClientInitializationError){
        if(err.errorCode==="P1000")
        statusCode=401;
        errorMessage="Authentication  failed .please check your credentials"
     }

     else if(err.errorCode==="P1001"){
        statusCode=400;
        errorMessage="Cant not reach database server"
     }

     res.status(statusCode)
     res.json({
        message:errorMessage,
        errors:errorDetails
     })


}

export default errorHandler