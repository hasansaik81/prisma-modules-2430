import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { string } from "better-auth/*";
import { error } from "node:console";
import { UserRole } from "../../middlewares/auth";





const createPost= async (req:Request,res:Response)=>{
        // res.send("create a new post");
        // console.log({req,res})

        try{
            const user=req.user;
            if(!user){
                return res.status(400).json({
                    error:"Unauthorized",
                })
            }
           const result =await postService.createPost(req.body,user.id as string)
           res.status(201).json(result)
        }catch(e){
            res.status(400).json({
                error:"post creation failed",
                details:e
            })

        }
    }

    const getAllPost= async (req:Request, res:Response)=>{
        try{
            const {search}=req.query;
            const seachString= typeof search ==='string'?search:undefined
            const tags=req.query.tags?(req.query.tags as string).split(","):[];
            const isFeatured=req.query.isFeatured
            ?req.query.isFeatured==='true'
            ?true
            :req.query.isFeatured==='false'
            ?false
            :undefined
           :undefined 
           const status=req.query.status as PostStatus | undefined
           const authorId=req.query.authorId as string |undefined
       

           const {page,limit,skip,sortBy,sortOrder}=paginationSortingHelper(req.query)

            const result= await postService.getAllPost({search:seachString ,tags,isFeatured,status,authorId, page,limit,skip,sortBy,sortOrder})
            res.status(200).json(result)

        }catch(e){
            res.status(400).json({
                error:"post creation failed",
                details:e
            })
        }
    }

    const getPostById= async (req:Request,res:Response)=>{
        try{
            const {postId}=req.params;
            if(!postId){
                throw new Error("postId is required")
            }
            const result=await postService.getPostById(postId);
            res.status(200).json(result)
        }catch(e){
            res.status(400).json({
                error:"post creation failed",
                details:e
            })
        }
    }

    const getMyPosts=async (req:Request ,res:Response)=>{
        try{
            const user =req.user;
            if(!user){
                throw new Error("you are not authorized")
            }
            const result =await postService.getMyPosts(user?.id as string)
            res.status(200).json(result)
        }catch(e){
            res.status(400).json({
                error:"post creation failed",
                details:e
            })
        }
    }


    const updatePost=async (req:Request ,res:Response)=>{
        try{
            const user =req.user;
            if(!user){
                throw new Error("you are not authorized")
            }

            const {postId}=req.params
            const isAdmin=user.role===UserRole.ADMIN
            const result =await postService.updatePost(postId as string,req.body, user.id,isAdmin)
            res.status(200).json(result)
        }catch(e){
            const errorMessage=(e instanceof Error)?e.message:"Post udate failed"
            res.status(400).json({
                error:errorMessage,
                details:e
            })
        }
    }
    
    
    const deletePost=async (req:Request ,res:Response)=>{
        try{
            const user =req.user;
            if(!user){
                throw new Error("you are not authorized")
            }

            const {postId}=req.params
            const isAdmin=user.role===UserRole.ADMIN
            const result =await postService.deletePost(postId as string, user.id,isAdmin)
            res.status(200).json(result)
        }catch(e){
            const errorMessage=(e instanceof Error)?e.message:"Post delete failed"
            res.status(400).json({
                error:errorMessage,
                details:e
            })
        }
    }

    
const getStats=async (req:Request,res:Response)=>{
    try{
        const result=await postService.getStats();
        res.status(200).json(result)
    }catch(e){
        const errorMessage=(e instanceof Error)?e.message:"stats feched failed!"
        res.status(400).json({
            error:errorMessage,
            details:e
        })
    }
}


    
    


    


    export const postController={
        createPost,
        getAllPost,
        getPostById,
        getMyPosts,
        updatePost,
        deletePost,
        getStats
    }


